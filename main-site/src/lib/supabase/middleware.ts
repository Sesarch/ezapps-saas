import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production'

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          // Set domain to .ezapps.app in production for cross-subdomain access
          const cookieOptions: Record<string, any> = isProduction
            ? { 
                ...options, 
                domain: '.ezapps.app',
                path: '/',
                sameSite: 'lax',
                secure: true,
              }
            : { ...options, path: '/' }
          
          supabaseResponse.cookies.set(name, value, cookieOptions)
        })
      },
    },
  })

  // Refresh the session
  const { data: { user } } = await supabase.auth.getUser()

  // Get hostname to check if we're on a subdomain
  const hostname = request.headers.get('host') || ''
  const hostnameParts = hostname.split('.')
  const isSubdomain = hostnameParts.length > 2 && !hostname.includes('localhost')

  // Protected routes - redirect to login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    // If on subdomain, redirect to main domain login
    if (isSubdomain) {
      const mainDomain = process.env.NODE_ENV === 'production' 
        ? 'https://ezapps.app/login'
        : 'http://localhost:3000/login'
      return NextResponse.redirect(mainDomain)
    }
    
    // If on main domain, just go to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  // But only on main domain - subdomains shouldn't have login/signup pages
  if (user && !isSubdomain && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/add-platform'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
