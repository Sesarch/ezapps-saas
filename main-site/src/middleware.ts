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
        // 🛡️ FIXED: Explicit typing to prevent Vercel build errors
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          supabaseResponse = NextResponse.next({ request })
          
          cookiesToSet.forEach(({ name, value, options }) => {
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

  // Handle protected routes
  if (isMainDomain && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/superadmin'))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // 🛡️ FIXED: Super admin email bypass - allow immediate access
    const isSuperAdminEmail = user?.email === 'sesarch@yahoo.com'
    
    // For super admin email, bypass database check entirely
    if (isSuperAdminEmail) {
      // Allow access to /superadmin routes
      if (url.pathname.startsWith('/superadmin')) {
        return supabaseResponse
      }
      // Redirect from /dashboard to /superadmin for super admin
      if (url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/superadmin', request.url))
      }
    }

    // For non-super admin users, check database permissions
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single()

      const isAdmin = profile?.is_admin || profile?.role === 'super_admin'

      // Block non-admins from /superadmin
      if (!isAdmin && url.pathname.startsWith('/superadmin')) {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }

      // Redirect base /dashboard to specific app
      if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }
    } catch (error) {
      // If database query fails, fall back to basic user access
      console.error('Profile lookup failed:', error)
      
      // Block from superadmin if not the super admin email
      if (url.pathname.startsWith('/superadmin')) {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }
      
      // Allow dashboard access
      if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
        return NextResponse.redirect(new URL('/dashboard/inventory', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|Shopify.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
