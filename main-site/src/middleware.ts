import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// List of valid platform subdomains
const VALID_PLATFORMS = [
  'shopify',
  'woocommerce',
  'wix',
  'bigcommerce',
  'squarespace',
  'magento',
  'opencart',
  'etsy',
  'amazon'
]

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl

  /**
   * 🔥 HARD REDIRECT
   * Force ALL traffic from ezapps.app → shopify.ezapps.app
   * This fixes auth, sessions, login hangs, and reset-password issues
   */
  if (
    process.env.NODE_ENV === 'production' &&
    hostname === 'ezapps.app'
  ) {
    const redirectUrl = url.clone()
    redirectUrl.hostname = 'shopify.ezapps.app'
    return NextResponse.redirect(redirectUrl)
  }

  // Extract subdomain (e.g. "shopify" from "shopify.ezapps.app")
  const subdomain = hostname.split('.')[0]
  const isPlatformSubdomain = VALID_PLATFORMS.includes(subdomain)

  /**
   * ✅ SUPER ADMIN ROUTES
   * Allow access without platform restrictions
   */
  if (url.pathname.startsWith('/superadmin')) {
    return await updateSession(request)
  }

  /**
   * ✅ PLATFORM SUBDOMAIN LOGIC
   * shopify.ezapps.app, woocommerce.ezapps.app, etc.
   */
  if (isPlatformSubdomain) {
    // Attach platform info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-platform', subdomain)

    const response = await updateSession(request)

    if (response) {
      response.headers.set('x-platform', subdomain)
    }

    return response
  }

  /**
   * ✅ DEFAULT
   * Let Supabase middleware handle auth/session
   */
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/superadmin/:path*',
    '/login',
    '/signup',
    '/auth/:path*',
    '/add-platform',
    '/reset-password',
    '/forgot-password',
  ],
}
