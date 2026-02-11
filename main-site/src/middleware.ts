import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  const isMainDomain = hostname.includes('ezapps.app') && !hostname.includes('shopify.')
  const isAppSubdomain = hostname.includes('shopify.ezapps.app')
  
  // APP SUBDOMAIN: Redirect auth pages to main domain
  if (isAppSubdomain) {
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(`https://ezapps.app${pathname}`)
    }
  }
  
  // MAIN DOMAIN: Redirect dashboard to app subdomain
  if (isMainDomain) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(`https://shopify.ezapps.app${pathname}`)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  // DO NOT include /login here - middleware should not run on login page AT ALL
  matcher: [
    '/dashboard/:path*', 
    '/superadmin/:path*'
  ],
}
