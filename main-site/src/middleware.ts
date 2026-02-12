import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Define the main domain and recognized platform subdomains
  const mainDomain = 'ezapps.app'
  const isMainDomain = hostname === mainDomain || hostname === `www.${mainDomain}` || hostname.includes('localhost')
  
  // Extract platform from subdomain (e.g., "shopify" from "shopify.ezapps.app")
  const subdomain = hostname.split('.')[0]
  const validPlatforms = ['shopify', 'woocommerce', 'wix', 'bigcommerce', 'squarespace', 'magento', 'opencart', 'etsy', 'amazon']
  const isPlatformSubdomain = validPlatforms.includes(subdomain)

  // 1. Create a Supabase response and client
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            // Share cookies across all .ezapps.app subdomains
            const cookieOptions: Record<string, any> = {
              ...options,
              domain: '.ezapps.app',
              path: '/',
              sameSite: 'lax',
              secure: true,
            }
            supabaseResponse.cookies.set(name, value, cookieOptions)
          })
        },
      },
    }
  )

  // 2. Refresh session if it exists
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Routing Logic
  
  // Accessing Dashboard on Main Domain: Redirect to platform selection
  if (isMainDomain && url.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Main domain doesn't host the dashboard directly in subdomain architecture
    return NextResponse.redirect(new URL('/add-platform', request.url))
  }

  // Accessing Protected Subdomain routes without auth
  if (isPlatformSubdomain && url.pathname.startsWith('/dashboard')) {
    if (!user) {
      // Redirect back to main domain login if session is missing on subdomain
      return NextResponse.redirect(new URL(`https://${mainDomain}/login?redirect=${hostname}${url.pathname}`, request.url))
    }
  }

  // 4. Set platform context header for the application to use
  if (isPlatformSubdomain) {
    supabaseResponse.headers.set('x-platform', subdomain)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, Shopify.png (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
