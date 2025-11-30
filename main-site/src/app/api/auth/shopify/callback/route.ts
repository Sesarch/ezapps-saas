import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const shop = searchParams.get('shop')
  const code = searchParams.get('code')

  console.log('Callback received:', { shop, code: code ? 'exists' : 'missing' })

  if (!shop || !code) {
    console.error('Missing params:', { shop, code })
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stores?error=missing_params`)
  }

  try {
    // Exchange code for access token
    console.log('Exchanging code for token...')
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
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      throw new Error('Failed to get access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log('Got access token')

    // Get shop info from Shopify
    console.log('Getting shop info...')
    const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    })

    const shopData = await shopResponse.json()
    const shopInfo = shopData.shop
    console.log('Shop info:', shopInfo?.name)

    // Create Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the first user (we'll improve this later with proper session handling)
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    console.log('Users query result:', { users, usersError })

    if (usersError || !users || users.length === 0) {
      console.error('No users found:', usersError)
      throw new Error('No users found in database')
    }

    const userId = users[0].id

    // Check if store already exists
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id')
      .eq('store_url', shop)
      .single()

    console.log('Existing store:', existingStore)

    if (existingStore) {
      // Update existing store
      const { error: updateError } = await supabase
        .from('stores')
        .update({
          access_token: accessToken,
          store_name: shopInfo.name,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingStore.id)

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Failed to update store')
      }
      console.log('Store updated')
    } else {
      // Insert new store
      const { error: insertError } = await supabase
        .from('stores')
        .insert({
          user_id: userId,
          platform_id: 'shopify',
          store_name: shopInfo.name,
          store_url: shop,
          access_token: accessToken,
          is_active: true,
        })

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error('Failed to save store: ' + insertError.message)
      }
      console.log('Store inserted')
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
