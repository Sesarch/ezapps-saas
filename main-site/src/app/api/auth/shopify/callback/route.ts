import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const shop = searchParams.get('shop')
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  console.log('CALLBACK - shop:', shop)
  console.log('CALLBACK - code:', code)
  console.log('CALLBACK - state:', state)

  if (!shop || !code || !state) {
    return NextResponse.redirect(new URL('/dashboard/stores?error=missing_params', request.url))
  }

  const cookieStore = cookies()
  
  // Verify state matches
  const savedState = cookieStore.get('shopify_oauth_state')?.value
  if (state !== savedState) {
    return NextResponse.redirect(new URL('/dashboard/stores?error=invalid_state', request.url))
  }

  // Clean the shop domain - Shopify sends "store.myshopify.com"
  const shopDomain = shop.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const storeName = shopDomain.replace(/\.myshopify\.com$/i, '')

  console.log('CALLBACK - shopDomain:', shopDomain)
  console.log('CALLBACK - storeName:', storeName)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url))
  }

  // Exchange code for access token
  const tokenResponse = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    }),
  })

  if (!tokenResponse.ok) {
    console.error('Token exchange failed:', await tokenResponse.text())
    return NextResponse.redirect(new URL('/dashboard/stores?error=token_exchange_failed', request.url))
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token

  console.log('CALLBACK - Got access token')

  // Save store to database
  const { error: dbError } = await supabase
    .from('stores')
    .upsert({
      user_id: user.id,
      platform_id: 'shopify',
      store_url: shopDomain,
      access_token: accessToken,
      is_active: true,
      connected_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,store_url'
    })

  if (dbError) {
    console.error('Database error:', dbError)
    return NextResponse.redirect(new URL('/dashboard/stores?error=database_error', request.url))
  }

  // Clear the state cookie
  cookieStore.delete('shopify_oauth_state')

  // Redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard/stores?success=store_connected', request.url))
}
