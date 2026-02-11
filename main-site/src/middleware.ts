import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  const isMainDomain = hostname.includes('ezapps.app') && !hostname.includes('shopify.')
  const isAppSubdomain = hostname.includes('shopify.ezapps.app')
  
  // APP SUBDOMAIN: Redirect login/signup to main domain
  if (isAppSubdomain) {
    if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password') {
      return NextResponse.redirect(`https://ezapps.app${pathname}${request.nextUrl.search}`)
    }
  }
  
  // MAIN DOMAIN: Redirect dashboard/superadmin to app subdomain
  if (isMainDomain) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(`https://shopify.ezapps.app${pathname}${request.nextUrl.search}`)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  // Run on dashboard, superadmin, and auth pages (for domain routing only)
  matcher: [
    '/dashboard/:path*', 
    '/superadmin/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ],
}
