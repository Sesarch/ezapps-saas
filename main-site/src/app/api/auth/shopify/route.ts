import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const shop = searchParams.get('shop')
  
  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 })
  }

  // Validate shop format (must be *.myshopify.com)
  const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/
  if (!shopRegex.test(shop)) {
    return NextResponse.json({ error: 'Invalid shop format' }, { status: 400 })
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID
  const scopes = process.env.SHOPIFY_SCOPES
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`
  
  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(7)
  
  // Build the authorization URL
  const authUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${clientId}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`

  // Redirect to Shopify authorization page
  return NextResponse.redirect(authUrl)
}
