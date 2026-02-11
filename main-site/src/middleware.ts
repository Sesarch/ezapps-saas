import { type NextRequest, NextResponse } from 'next/server'

// SIMPLE - Just route between domains, NO AUTH CHECKS
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  // If on main domain trying to access dashboard → redirect to app subdomain
  if (hostname.includes('ezapps.app') && !hostname.includes('shopify.')) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(`https://shopify.ezapps.app${pathname}`)
    }
  }
  
  // Everything else - just continue, NO REDIRECTS
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/superadmin/:path*'],
}
