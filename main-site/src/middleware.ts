import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Define domains
  const mainDomain = 'ezapps.app'
  const isMainDomain = hostname === mainDomain || hostname === `www.${mainDomain}` || hostname.includes('localhost')
  
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

  const { data: { user } } = await supabase.auth.getUser()

  // If user tries to access any dashboard path on the main domain
  if (isMainDomain && url.pathname.startsWith('/dashboard')) {
    if (!user) {
      // If not logged in, send to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // If logged in, STAY HERE (do not redirect to add-platform)
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
