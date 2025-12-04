import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storeName = searchParams.get('store')

  if (!storeName) {
    return NextResponse.json({ error: 'Store name required' }, { status: 400 })
  }

  try {
    // Get store from database
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('store_name', storeName)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Fetch orders from Shopify
    const shopifyUrl = `https://${store.store_name}.myshopify.com/admin/api/2024-01/orders.json?status=any&limit=50`
    
    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify API error:', errorText)
      return NextResponse.json({ error: 'Failed to fetch orders from Shopify' }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json({ orders: data.orders || [] })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
