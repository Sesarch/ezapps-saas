import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
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
              domain: '.ezapps.app',
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

  if (isMainDomain) {
    // Check role if user is hitting dashboard or superadmin paths
    if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/superadmin')) {
      if (!user) return NextResponse.redirect(new URL('/login', request.url))
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single()

      const isAdmin = profile?.is_admin === true || profile?.role === 'super_admin'

      // 1. If Admin tries to go to user dashboard, send to superadmin
      if (isAdmin && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/superadmin', request.url))
      }

      // 2. If Normal User tries to go to superadmin, send to inventory
      if (!isAdmin && url.pathname.startsWith('/superadmin')) {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }

      // 3. Handle the base /dashboard redirect for non-admins
      if (!isAdmin && (url.pathname === '/dashboard' || url.pathname === '/dashboard/')) {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
