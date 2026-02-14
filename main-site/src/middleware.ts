import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const isMainDomain = hostname === 'ezapps.app' || hostname === 'www.ezapps.app' || hostname.includes('localhost')
  
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { 
          return request.cookies.getAll() 
        },
        setAll(cookiesToSet) {
          // 1. Update request cookies for the current session
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // 2. Refresh the response object
          supabaseResponse = NextResponse.next({ request })
          
          // 3. Set the cookies on the response for the browser
          // We spread the rest of the properties directly into the options object
          cookiesToSet.forEach(({ name, value, ...options }) => {
            supabaseResponse.cookies.set(name, value, { 
              ...options, 
              domain: '.ezapps.app', 
              path: '/', 
              sameSite: 'lax', 
              secure: true 
            })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (isMainDomain && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/superadmin'))) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    
    // Security Fix: Manual Identity Check
    const isSuperAdminEmail = user.email === 'sesarch@yahoo.com'
    const { data: profile } = await supabase.from('profiles').select('role, is_admin').eq('id', user.id).single()
    const isAdmin = isSuperAdminEmail || profile?.is_admin || profile?.role === 'super_admin'

    // Prevent non-admins from entering /superadmin
    if (!isAdmin && url.pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
    }

    // Redirect base /dashboard to inventory
    if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
      return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
