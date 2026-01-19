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
  
  // Skip middleware for auth callback route
  if (url.pathname === '/auth/callback-subdomain') {
    return NextResponse.next()
  }
  
  // Extract subdomain (e.g., "shopify" from "shopify.ezapps.app")
  const subdomain = hostname.split('.')[0]
  
  // Check if we're on a platform subdomain
  const isPlatformSubdomain = VALID_PLATFORMS.includes(subdomain)
  const isMainDomain = !isPlatformSubdomain && (hostname.includes('ezapps.app') || hostname.includes('localhost'))
  
  // Platform subdomain logic
  if (isPlatformSubdomain) {
    // Add platform to request headers so we can access it in components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-platform', subdomain)
    
    const response = await updateSession(request)
    
    // Add platform header to response
    if (response) {
      response.headers.set('x-platform', subdomain)
    }
    
    return response
  }
  
  // Main domain logic - only allow dashboard access from platform subdomains
  // EXCEPT for /dashboard/stores which is needed to connect first store
  if (isMainDomain && url.pathname.startsWith('/dashboard') && url.pathname !== '/dashboard/stores') {
    // Redirect to platform selection or first connected store
    return NextResponse.redirect(new URL('/add-platform', request.url))
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/auth/:path*',
  ],
}
