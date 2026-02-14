import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 1. Define the exact structure TypeScript is looking for
interface SupabaseCookie {
  name: string
  value: string
  [key: string]: any // This covers path, domain, maxAge, etc.
}

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
        // 2. Explicitly type the parameter here
        setAll(cookiesToSet: SupabaseCookie[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          supabaseResponse = NextResponse.next({ request })
          
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
    
    // Security Fix: Identity Verification bypasses database latency
    const isSuperAdminEmail = user.email === 'sesarch@yahoo.com'
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single()

    const isAdmin = isSuperAdminEmail || profile?.is_admin || profile?.role === 'super_admin'

    // Block non-admins from /superadmin
    if (!isAdmin && url.pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
    }

    // Redirect base /dashboard to specific app
    if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
      return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
