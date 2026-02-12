import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Identify if we are on the main domain
  const mainDomain = 'ezapps.app'
  const isMainDomain = hostname === mainDomain || hostname === `www.${mainDomain}` || hostname.includes('localhost')
  
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, {
              ...options,
              domain: '.ezapps.app', // Critical for session persistence
              path: '/',
              sameSite: 'lax',
              secure: true,
            })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Logic for the Main Domain
  if (isMainDomain && url.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Redirect base /dashboard to the working inventory subfolder
    if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
      return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
