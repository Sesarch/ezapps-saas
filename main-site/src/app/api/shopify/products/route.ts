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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get store info
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single()

    console.log('Store found:', store?.store_url, 'Error:', storeError)

    if (storeError || !store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // TRY 1: Fetch from database first (fast and reliable)
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })

    console.log('Database products:', dbProducts?.length, 'Error:', dbError)

    // If we have products in database, use them
    if (dbProducts && dbProducts.length > 0) {
      console.log('✅ Using products from database')
      const transformedProducts = dbProducts.map(product => ({
        id: product.product_id,
        title: product.title,
        vendor: product.description || '',
        status: product.status,
        variants: [{
          id: product.id,
          sku: product.sku,
          price: product.price,
          inventory_quantity: product.inventory_quantity
        }],
        image: null
      }))
      
      return NextResponse.json({ products: transformedProducts, source: 'database' })
    }

    // TRY 2: If no products in DB and we have access_token, try Shopify API
    if (store.access_token) {
      console.log('⚠️ No products in DB, trying Shopify API...')
      
      let shopDomain = store.store_url
      shopDomain = shopDomain.replace('https://', '').replace('http://', '')

      const shopifyUrl = `https://${shopDomain}/admin/api/2024-01/products.json?limit=50`
      
      const response = await fetch(shopifyUrl, {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
        },
      })

      console.log('Shopify API response:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Fetched from Shopify API:', data.products?.length)
        return NextResponse.json({ products: data.products, source: 'shopify' })
      } else {
        console.error('Shopify API failed:', response.status)
      }
    }

    // TRY 3: No products anywhere - return empty with helpful message
    console.log('❌ No products found in database or Shopify')
    return NextResponse.json({ 
      products: [], 
      source: 'none',
      message: 'No products found. Please add products to your store or sync from Shopify.'
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
