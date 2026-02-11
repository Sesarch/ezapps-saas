import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  const isMainDomain = hostname.includes('ezapps.app') && !hostname.includes('shopify.')
  const isAppSubdomain = hostname.includes('shopify.ezapps.app')
  
  // Redirect auth pages from shopify subdomain to main domain
  if (isAppSubdomain && (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password')) {
    return NextResponse.redirect(`https://ezapps.app${pathname}`)
  }
  
  // Redirect dashboard from main domain to shopify subdomain
  if (isMainDomain && (pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin'))) {
    return NextResponse.redirect(`https://shopify.ezapps.app${pathname}`)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/superadmin/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ],
}
