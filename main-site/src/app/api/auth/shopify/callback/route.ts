import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const shop = searchParams.get('shop')
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  console.log('=== SHOPIFY CALLBACK START ===')
  console.log('Shop:', shop)
  console.log('Code exists:', !!code)
  console.log('State:', state)

  if (!shop || !code) {
    console.error('Missing params')
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stores?error=missing_params`)
  }

  // Extract user ID from state (format: "userId_randomString")
  const userId = state?.split('_')[0]
  
  if (!userId || userId.length < 30) {
    console.error('Invalid user ID in state:', userId)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stores?error=invalid_user`)
  }

  console.log('User ID:', userId)

  try {
    // Step 1: Exchange code for access token
    console.log('Step 1: Exchanging code for token...')
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      throw new Error('Failed to get access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log('Got access token:', accessToken ? 'YES' : 'NO')

    if (!accessToken) {
      throw new Error('No access token in response')
    }

    // Step 2: Get shop info from Shopify
    console.log('Step 2: Getting shop info...')
    const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
      headers: { 'X-Shopify-Access-Token': accessToken },
    })

    if (!shopResponse.ok) {
      throw new Error('Failed to get shop info')
    }

    const shopData = await shopResponse.json()
    const shopName = shopData.shop?.name || shop.replace('.myshopify.com', '')
    console.log('Shop name:', shopName)

    // Step 3: Save to database using service role (bypasses RLS)
    console.log('Step 3: Saving to database...')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First, delete any existing store with this URL to avoid conflicts
    console.log('Deleting existing store with URL:', shop)
    const { error: deleteError } = await supabase
      .from('stores')
      .delete()
      .eq('store_url', shop)
    
    if (deleteError) {
      console.log('Delete error (may be ok if no existing):', deleteError.message)
    }

    // Now insert the new store
    console.log('Inserting new store...')
    const { data: insertedStore, error: insertError } = await supabase
      .from('stores')
      .insert({
        user_id: userId,
        platform_id: 'shopify',
        store_name: shopName,
        store_url: shop,
        access_token: accessToken,
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error('Failed to save store: ' + insertError.message)
    }

    console.log('Store saved successfully! ID:', insertedStore?.id)
    console.log('=== SHOPIFY CALLBACK SUCCESS ===')

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stores?success=true&shop=${encodeURIComponent(shopName)}`
    )

  } catch (error: any) {
    console.error('=== SHOPIFY CALLBACK ERROR ===')
    console.error('Error:', error.message)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stores?error=oauth_failed`
    )
  }
}
