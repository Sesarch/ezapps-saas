import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Define the main domain and recognized platform subdomains
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
        // ADDED TYPE DEFINITION HERE TO FIX THE BUILD ERROR
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions: Record<string, any> = {
              ...options,
              domain: '.ezapps.app', // Share session across subdomains
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

  // Accessing Dashboard on Main Domain: Redirect to platform selection
  if (isMainDomain && url.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Accessing Protected Subdomain routes without auth
  if (isPlatformSubdomain && url.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL(`https://${mainDomain}/login?redirect=${hostname}${url.pathname}`, request.url))
    }
  }

  if (isPlatformSubdomain) {
    supabaseResponse.headers.set('x-platform', subdomain)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Exclude internal routes and static assets from middleware
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
