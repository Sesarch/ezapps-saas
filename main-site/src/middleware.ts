import { type NextRequest, NextResponse } from 'next/server'

// Simple routing - don't touch login/signup/auth pages AT ALL
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  const isMainDomain = hostname.includes('ezapps.app') && !hostname.includes('shopify.')
  
  // ONLY redirect dashboard/superadmin to app subdomain
  // Everything else (including login) - don't touch!
  if (isMainDomain) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(`https://shopify.ezapps.app${pathname}${request.nextUrl.search}`)
    }
  }
  
  // Everything else - just pass through
  return NextResponse.next()
}

export const config = {
  // ONLY run on dashboard and superadmin routes
  matcher: ['/dashboard/:path*', '/superadmin/:path*'],
}
