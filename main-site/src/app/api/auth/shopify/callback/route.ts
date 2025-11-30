import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const shop = searchParams.get('shop')
  const code = searchParams.get('code')

  if (!shop || !code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stores?error=missing_params`)
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get shop info from Shopify
    const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    })

    const shopData = await shopResponse.json()
    const shopInfo = shopData.shop

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get Shopify platform ID
    const { data: platform } = await supabase
      .from('platforms')
      .select('id')
      .eq('slug', 'shopify')
      .single()

    if (!platform) {
      throw new Error('Shopify platform not found in database')
    }

    // Get user from cookie/session (we'll use shop email for now)
    // In production, you'd get the user_id from the session
    
    // Check if store already exists
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id')
      .eq('store_url', shop)
      .single()

    if (existingStore) {
      // Update existing store
      await supabase
        .from('stores')
        .update({
          access_token: accessToken,
          store_name: shopInfo.name,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingStore.id)
    } else {
      // For now, we'll get the first admin user to associate the store
      // In production, you'd get this from the session
      const { data: adminUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true)
        .limit(1)
        .single()

      if (!adminUser) {
        throw new Error('No admin user found')
      }

      // Insert new store
      await supabase
        .from('stores')
        .insert({
          user_id: adminUser.id,
          platform_id: platform.id,
          store_name: shopInfo.name,
          store_url: shop,
          access_token: accessToken,
          is_active: true,
        })
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stores?success=true&shop=${encodeURIComponent(shopInfo.name)}`
    )

  } catch (error) {
    console.error('Shopify OAuth error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stores?error=oauth_failed`
    )
  }
}
