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
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, { ...options, domain: '.ezapps.app', path: '/', sameSite: 'lax', secure: true })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (isMainDomain && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/superadmin'))) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    
    // 🛡️ THE SECURITY FIX
    // Check if the user is YOU specifically by email
    const isSuperAdminEmail = user.email === 'sesarch@yahoo.com'

    // If not you, we check the database for other admins
    const { data: profile } = await supabase.from('profiles').select('role, is_admin').eq('id', user.id).single()
    const isAdmin = isSuperAdminEmail || profile?.is_admin || profile?.role === 'super_admin'

    // 🚀 NEW ROUTING LOGIC
    // 1. If you are the Super Admin and try to go to user dashboard, let you stay or move to admin
    if (isSuperAdminEmail && url.pathname.startsWith('/dashboard')) {
       // Optional: Allow admin to see dashboard, or force them to /superadmin
       // return NextResponse.redirect(new URL('/superadmin', request.url))
    }

    // 2. If NOT an admin and trying to access /superadmin -> KICK TO DASHBOARD
    if (!isAdmin && url.pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
    }

    // 3. Handle the base /dashboard redirect
    if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
      return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
