import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storeUrl = searchParams.get('store')

  if (!storeUrl) {
    return NextResponse.json({ error: 'Store URL required' }, { status: 400 })
  }

  try {
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('store_url', storeUrl)
      .single()

    if (storeError || !store) {
      console.error('Store lookup error:', storeError)
      return NextResponse.json({ error: 'Store not found', storeUrl }, { status: 404 })
    }

    let shopDomain = store.store_url
    shopDomain = shopDomain.replace('https://', '').replace('http://', '')

    const shopifyUrl = `https://${shopDomain}/admin/api/2024-01/orders.json?status=any&limit=50`
    
    console.log('Fetching orders from:', shopifyUrl)

    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify API error:', response.status, errorText)
      return NextResponse.json({ 
        error: 'Failed to fetch orders from Shopify',
        details: errorText 
      }, { status: response.status })
    }

    const data = await response.json()
    const orders = data.orders || []

    for (const order of orders) {
      const orderData = {
        store_id: store.id,
        shopify_order_id: order.id.toString(),
        order_number: order.order_number?.toString() || '',
        order_name: order.name || '',
        customer_name: order.customer?.first_name 
          ? `${order.customer.first_name} ${order.customer.last_name || ''}`.trim()
          : null,
        customer_email: order.customer?.email || null,
        total_price: parseFloat(order.total_price) || 0,
        fulfillment_status: order.fulfillment_status || 'unfulfilled',
        financial_status: order.financial_status || null,
        order_date: order.created_at,
        updated_at: new Date().toISOString()
      }

      const { data: savedOrder, error: orderError } = await supabase
        .from('shopify_orders')
        .upsert(orderData, { onConflict: 'store_id,shopify_order_id' })
        .select()
        .single()

      if (orderError) {
        console.error('Error saving order:', orderError)
        continue
      }

      if (order.line_items && order.line_items.length > 0) {
        for (const item of order.line_items) {
          const lineItemData = {
            store_id: store.id,
            order_id: savedOrder.id,
            shopify_line_item_id: item.id.toString(),
            shopify_product_id: item.product_id?.toString() || null,
            shopify_variant_id: item.variant_id?.toString() || null,
            product_title: item.title || '',
            variant_title: item.variant_title || null,
            quantity: item.quantity || 1,
            price: parseFloat(item.price) || 0
          }

          await supabase
            .from('order_line_items')
            .upsert(lineItemData, { onConflict: 'order_id,shopify_line_item_id' })
        }
      }
    }

    await recalculateCommitted(store.id)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function recalculateCommitted(storeId: string) {
  try {
    const { error } = await supabase.rpc('recalculate_committed', {
      p_store_id: storeId
    })
    
    if (error) {
      console.error('Error calling recalculate_committed:', error)
    } else {
      console.log('Committed inventory recalculated successfully')
    }
  } catch (error) {
    console.error('Error recalculating committed:', error)
  }
}
