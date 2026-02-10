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
    
    // For public/auth pages, just update session
    return await updateSession(request)
  }
  
  // APP SUBDOMAIN (shopify.ezapps.app) - Authenticated pages only
  if (isAppSubdomain) {
    // All pages here require authentication
    return await updateSession(request)
  }
  
  // Default: update session
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/superadmin/:path*',
    '/login',
    '/signup',
    '/auth/:path*',
  ],
}
