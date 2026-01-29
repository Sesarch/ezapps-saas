import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Get store details
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .eq('is_active', true)
      .single();

    if (storeError || !store) {
      return NextResponse.json({ error: 'Store not found or inactive' }, { status: 404 });
    }

    // Fetch products from Shopify
    const shopifyUrl = `https://${store.store_url}/admin/api/2024-01/products.json`;
    
    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API Error:', errorText);
      return NextResponse.json({ 
        error: 'Failed to fetch products from Shopify',
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // FILTER OUT TEST PRODUCTS
    const realProducts = (data.products || []).filter((product: any) => {
      const firstVariant = product.variants?.[0];
      const sku = firstVariant?.sku || '';
      
      // Exclude test products by SKU pattern
      return !sku.startsWith('TEST-') && 
             !sku.startsWith('YOUR-SKU-') &&
             !product.title.toLowerCase().includes('test product');
    });

    return NextResponse.json({ 
      products: realProducts,
      total: realProducts.length 
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
