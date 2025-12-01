import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const storeId = searchParams.get('storeId')

  console.log('Products API called with storeId:', storeId)

  if (!storeId) {
    return NextResponse.json({ error: 'Missing storeId' }, { status: 400 })
  }

  try {
    // Get store from database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single()

    console.log('Store found:', store?.store_name, 'Error:', storeError)

    if (storeError || !store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Fetch products from Shopify
    const shopifyUrl = `https://${store.store_url}/admin/api/2024-01/products.json?limit=50`
    console.log('Fetching from Shopify:', shopifyUrl)

    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
      },
    })

    console.log('Shopify response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify API error:', errorText)
      return NextResponse.json({ error: 'Failed to fetch products from Shopify' }, { status: 500 })
    }

    const data = await response.json()
    console.log('Products found:', data.products?.length)
    
    return NextResponse.json({ products: data.products })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
