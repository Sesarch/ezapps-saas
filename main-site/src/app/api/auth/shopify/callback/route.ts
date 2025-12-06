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

  if (!shop || !code) {
    return NextResponse.redirect(new URL('/dashboard/stores?error=missing_params', request.url))
  }

  const cookieStore = cookies()
  
  // Clean the shop domain - Shopify sends "store.myshopify.com"
  const shopDomain = shop.replace(/^https?:\/\//, '').replace(/\/$/, '')

  console.log('CALLBACK - shopDomain:', shopDomain)

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
    const errorText = await tokenResponse.text()
    console.error('Token exchange failed:', errorText)
    return NextResponse.redirect(new URL('/dashboard/stores?error=token_exchange_failed', request.url))
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token
  const scope = tokenData.scope

  console.log('CALLBACK - Got access token, scope:', scope)

  // Save store to database - simple insert
  const { data, error: dbError } = await supabase
    .from('stores')
    .insert({
      user_id: user.id,
      platform_id: 'shopify',
      store_url: shopDomain,
      access_token: accessToken,
      scope: scope,
    })
    .select()

  if (dbError) {
    console.error('Database error:', JSON.stringify(dbError))
    return NextResponse.redirect(new URL('/dashboard/stores?error=database_error', request.url))
  }

  console.log('CALLBACK - Store saved:', data)

  // Clear the state cookie
  cookieStore.delete('shopify_oauth_state')

  // Redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard/stores?success=store_connected', request.url))
}
