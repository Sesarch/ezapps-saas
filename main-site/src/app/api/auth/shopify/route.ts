import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const shop = searchParams.get('shop')

  console.log('DEBUG - Raw shop param:', shop)

  if (!shop) {
    return NextResponse.redirect(new URL('/dashboard/stores?error=missing_shop', request.url))
  }

  const storeName = shop
    .trim()
    .toLowerCase()
    .replace(/\.myshopify\.com$/i, '')
    .replace(/^https?:\/\//i, '')

  console.log('DEBUG - Cleaned storeName:', storeName)

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

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url))
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`
  const scopes = 'read_orders,read_products,read_inventory'
  const state = crypto.randomUUID()

  console.log('DEBUG - redirectUri:', redirectUri)

  cookieStore.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  })

  const shopifyAuthUrl = `https://${storeName}.myshopify.com/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

  console.log('DEBUG - Final shopifyAuthUrl:', shopifyAuthUrl)

  return NextResponse.redirect(shopifyAuthUrl)
}
