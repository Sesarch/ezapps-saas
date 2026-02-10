import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 🎯 PRODUCTION-ONLY - Cookie domain .ezapps.app for cross-domain auth
// Works on BOTH: ezapps.app AND shopify.ezapps.app

export async function updateSession(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const isMainDomain = hostname.includes('ezapps.app') && !hostname.includes('shopify.')
  const isAppSubdomain = hostname.includes('shopify.ezapps.app')
  
  // Skip auth check for callback routes
  if (request.nextUrl.pathname === '/auth/callback-subdomain' || 
      request.nextUrl.pathname === '/auth/callback') {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          // 🔑 CRITICAL: Cookie domain MUST be .ezapps.app (with leading dot!)
          // This allows cookies to work on BOTH ezapps.app AND shopify.ezapps.app
          const cookieOptions: Record<string, any> = {
            ...options,
            domain: '.ezapps.app',  // ← THE DOT IS CRITICAL!
            path: '/',
            sameSite: 'lax',
            secure: true,
          }
          
          supabaseResponse.cookies.set(name, value, cookieOptions)
        })
      },
    },
  })

  // Refresh the session
  const { data: { user } } = await supabase.auth.getUser()

  // APP SUBDOMAIN: Require authentication for dashboard/superadmin
  if (isAppSubdomain) {
    if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || 
                   request.nextUrl.pathname.startsWith('/superadmin'))) {
      // Not authenticated → redirect to main domain login
      return NextResponse.redirect('https://ezapps.app/login')
    }
  }

  // MAIN DOMAIN: Redirect logged-in users away from auth pages
  if (isMainDomain) {
    if (user && (request.nextUrl.pathname === '/login' || 
                 request.nextUrl.pathname === '/signup')) {
      // Already logged in → redirect to app subdomain
      return NextResponse.redirect('https://shopify.ezapps.app/dashboard')
    }
  }

  return supabaseResponse
}
