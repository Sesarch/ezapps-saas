import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const shop = searchParams.get('shop')
  
  console.log('Auth route called with shop:', shop)
  
  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 })
  }

  const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/
  if (!shopRegex.test(shop)) {
    return NextResponse.json({ error: 'Invalid shop format' }, { status: 400 })
  }

  // Get the current user from Supabase session
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.log('No user session found, redirecting to login')
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?redirect=/dashboard/stores`)
  }

  console.log('User found:', user.id)

  const clientId = process.env.SHOPIFY_CLIENT_ID
  const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_inventory,write_inventory'
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`
  
  // Include user ID in state for the callback
  const state = `${user.id}_${Math.random().toString(36).substring(7)}`
  
  const authUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${clientId}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`

  console.log('Redirecting to:', authUrl)

  return NextResponse.redirect(authUrl)
}
