import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let shop = searchParams.get('shop')
  
  if (!shop) {
    return NextResponse.redirect(new URL('/dashboard/stores?error=missing_shop', request.url))
  }

  // Clean up shop name - remove .myshopify.com if user included it
  shop = shop.replace(/\.myshopify\.com$/i, '').trim()

  const cookieStore = cookies()
  
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
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url))
  }

  // Build Shopify OAuth URL
  const clientId = process.env.SHOPIFY_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`
  const scopes = 'read_orders,read_products,read_inventory'
  const state = crypto.randomUUID()
  
  // Store state in cookie for CSRF protection
  cookieStore.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  const shopifyAuthUrl = `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

  return NextResponse.redirect(shopifyAuthUrl)
}
