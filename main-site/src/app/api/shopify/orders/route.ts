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
    // Get store from database - check both store_name and shop_url
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .or(`store_name.eq.${storeName},shop_url.ilike.${storeName}%`)
      .limit(1)
      .single()

    if (storeError || !store) {
      console.error('Store lookup error:', storeError)
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Extract shop domain from shop_url or construct from store_name
    let shopDomain = store.shop_url
    if (!shopDomain) {
      shopDomain = `${store.store_name}.myshopify.com`
    }
    // Remove protocol if present
    shopDomain = shopDomain.replace('https://', '').replace('http://', '')

    // Fetch orders from Shopify
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
        details: errorText,
        status: response.status 
      }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json({ orders: data.orders || [] })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
