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

    // First verify the store exists
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single()

    console.log('Store found:', store?.store_url, 'Error:', storeError)

    if (storeError || !store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Fetch products from database instead of Shopify API
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })

    console.log('Products found in database:', products?.length, 'Error:', productsError)

    if (productsError) {
      console.error('Database error:', productsError)
      return NextResponse.json({ error: 'Failed to fetch products from database' }, { status: 500 })
    }

    // Transform database products to match Shopify format for frontend compatibility
    const transformedProducts = (products || []).map(product => ({
      id: product.product_id,
      title: product.title,
      vendor: product.description || '', // Using description as vendor for now
      status: product.status,
      variants: [{
        id: product.id,
        sku: product.sku,
        price: product.price,
        inventory_quantity: product.inventory_quantity
      }],
      image: null // No images in database yet
    }))
    
    return NextResponse.json({ products: transformedProducts })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
