import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Define domains
  const mainDomain = 'ezapps.app'
  const isMainDomain = hostname === mainDomain || hostname === `www.${mainDomain}` || hostname.includes('localhost')
  
  // Extract platform from subdomain
  const subdomain = hostname.split('.')[0]
  const validPlatforms = ['shopify', 'woocommerce', 'wix', 'bigcommerce', 'squarespace', 'magento', 'opencart', 'etsy', 'amazon']
  const isPlatformSubdomain = validPlatforms.includes(subdomain)

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
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions: Record<string, any> = {
              ...options,
              domain: '.ezapps.app', // Required for cross-subdomain sessions
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

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Handle Main Domain Dashboard Access
  if (isMainDomain && url.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Stay on the main domain dashboard where your files exist
    return supabaseResponse
  }

  // 2. Handle Subdomain Dashboard Access
  if (isPlatformSubdomain && url.pathname.startsWith('/dashboard')) {
    if (!user) {
      // Redirect to main domain login if session is missing
      return NextResponse.redirect(new URL(`https://${mainDomain}/login`, request.url))
    }
  }

  // 3. Set platform context header
  if (isPlatformSubdomain) {
    supabaseResponse.headers.set('x-platform', subdomain)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Exclude API and static assets from middleware to prevent 401 errors
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
