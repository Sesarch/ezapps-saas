import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// CORS headers to allow requests from subdomains
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storeUrl = searchParams.get('store')

  if (!storeUrl) {
    return NextResponse.json({ error: 'Store URL required' }, { status: 400, headers: corsHeaders })
  }

  try {
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('store_url', storeUrl)
      .single()

    if (storeError || !store) {
      console.error('Store lookup error:', storeError)
      return NextResponse.json({ error: 'Store not found', storeUrl }, { status: 404, headers: corsHeaders })
    }

    let shopDomain = store.store_url
    shopDomain = shopDomain.replace('https://', '').replace('http://', '')

    const shopifyUrl = `https://${shopDomain}/admin/api/2024-10/orders.json?status=any&limit=50`
    
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
      }, { status: response.status, headers: corsHeaders })
    }

    const data = await response.json()
    const orders = data.orders || []

    for (const order of orders) {
      // Determine fulfillment status
      let fulfillmentStatus = 'unfulfilled'
      
      if (order.fulfillment_status === 'fulfilled') {
        fulfillmentStatus = 'fulfilled'
      } else if (order.fulfillment_status === 'partial') {
        fulfillmentStatus = 'partial'
      } else if (order.fulfillments && order.fulfillments.length > 0) {
        const lineItemCount = order.line_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        const fulfilledCount = order.fulfillments.reduce((sum: number, f: any) => {
          return sum + (f.line_items?.reduce((s: number, li: any) => s + li.quantity, 0) || 0)
        }, 0)
        
        if (fulfilledCount >= lineItemCount) {
          fulfillmentStatus = 'fulfilled'
        } else if (fulfilledCount > 0) {
          fulfillmentStatus = 'partial'
        }
      }
      
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
        fulfillment_status: fulfillmentStatus,
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

    // Recalculate committed inventory
    await recalculateCommitted(store.id)

    return NextResponse.json({ 
      orders,
      message: `Synced ${orders.length} orders and recalculated committed inventory`
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
  }
}

// POST endpoint to manually recalculate committed inventory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId } = body

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID required' }, { status: 400, headers: corsHeaders })
    }

    await recalculateCommitted(storeId)

    return NextResponse.json({ 
      success: true, 
      message: 'Committed inventory recalculated successfully' 
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
  }
}

async function recalculateCommitted(storeId: string) {
  try {
    // Try calling the database function first
    const { error: rpcError } = await supabase.rpc('recalculate_committed', {
      p_store_id: storeId
    })
    
    if (rpcError) {
      console.error('RPC error, falling back to direct calculation:', rpcError)
      // Fallback: Do the calculation directly in code
      await fallbackRecalculate(storeId)
    } else {
      console.log('Committed inventory recalculated via database function')
    }
  } catch (error) {
    console.error('Error recalculating committed:', error)
    // Try fallback
    await fallbackRecalculate(storeId)
  }
}

async function fallbackRecalculate(storeId: string) {
  try {
    // Reset all parts to 0 committed
    await supabase
      .from('parts')
      .update({ committed: 0 })
      .eq('store_id', storeId)

    // Get all unfulfilled orders with their line items
    const { data: lineItems } = await supabase
      .from('order_line_items')
      .select(`
        quantity,
        shopify_variant_id,
        shopify_orders!inner(fulfillment_status)
      `)
      .eq('store_id', storeId)
      .or('fulfillment_status.eq.unfulfilled,fulfillment_status.is.null', { foreignTable: 'shopify_orders' })

    if (!lineItems || lineItems.length === 0) {
      console.log('No unfulfilled order line items found')
      return
    }

    // Get all BOM items for this store
    const { data: bomItems } = await supabase
      .from('bom_items')
      .select('part_id, shopify_variant_id, quantity_needed')
      .eq('store_id', storeId)

    if (!bomItems || bomItems.length === 0) {
      console.log('No BOM items found')
      return
    }

    // Calculate committed for each part
    const partCommitted: Record<string, number> = {}

    for (const lineItem of lineItems) {
      const variantId = lineItem.shopify_variant_id
      if (!variantId) continue

      const matchingBoms = bomItems.filter(b => b.shopify_variant_id === variantId)
      
      for (const bom of matchingBoms) {
        const committed = lineItem.quantity * bom.quantity_needed
        partCommitted[bom.part_id] = (partCommitted[bom.part_id] || 0) + committed
      }
    }

    // Update parts with calculated committed values
    for (const [partId, committed] of Object.entries(partCommitted)) {
      await supabase
        .from('parts')
        .update({ committed })
        .eq('id', partId)
    }

    console.log('Fallback committed calculation complete:', partCommitted)
  } catch (error) {
    console.error('Fallback recalculate error:', error)
  }
}
