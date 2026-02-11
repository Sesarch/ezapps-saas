import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  const isAppSubdomain = hostname.includes('shopify.ezapps.app')
  const isMainDomain = hostname.includes('ezapps.app') && !hostname.includes('shopify.')
  
  // If on shopify subdomain trying to access login/signup
  // Redirect to main domain
  if (isAppSubdomain && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(`https://ezapps.app${pathname}`)
  }
  
  // If on main domain trying to access dashboard
  // Redirect to shopify subdomain  
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
    '/signup'
  ],
}
