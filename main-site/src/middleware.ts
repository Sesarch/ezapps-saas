import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 🎯 PRODUCTION-ONLY - TWO DOMAIN ARCHITECTURE
// ezapps.app = Public pages (homepage, login, signup, etc.)
// shopify.ezapps.app = App pages (dashboard, all authenticated)

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl
  
  // Determine which domain we're on
  const isMainDomain = hostname.includes('ezapps.app') && !hostname.includes('shopify.')
  const isAppSubdomain = hostname.includes('shopify.ezapps.app')
  
  // MAIN DOMAIN (ezapps.app) - Public + Auth pages
  if (isMainDomain) {
    // If trying to access dashboard/superadmin from main domain
    // Redirect to app subdomain
    if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(`https://shopify.ezapps.app${url.pathname}${url.search}`)
    }
    
    // For public/auth pages, just update session (don't redirect!)
    return await updateSession(request)
  }
  
  // APP SUBDOMAIN (shopify.ezapps.app) - Authenticated pages only
  if (isAppSubdomain) {
    // Update session and check authentication
    return await updateSession(request)
  }
  
  // Default: update session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
