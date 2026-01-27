import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // CRITICAL: Only run in browser
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be used in browser environment')
  }

  // Detect if we're in production
  const isProduction = !window.location.hostname.includes('localhost') && 
                       !window.location.hostname.includes('127.0.0.1')
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Safe check for document
          if (typeof document === 'undefined') {
            return []
          }
          
          return document.cookie
            .split('; ')
            .map(cookie => {
              const [name, value] = cookie.split('=')
              return { name, value: decodeURIComponent(value) }
            })
            .filter(cookie => cookie.name && cookie.value)
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          // Safe check for document
          if (typeof document === 'undefined') {
            return
          }

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
            
            let cookieString = `${name}=${encodeURIComponent(value)}`
            
            if (cookieOptions.domain) cookieString += `; domain=${cookieOptions.domain}`
            if (cookieOptions.path) cookieString += `; path=${cookieOptions.path}`
            if (cookieOptions.maxAge) cookieString += `; max-age=${cookieOptions.maxAge}`
            if (cookieOptions.expires) cookieString += `; expires=${new Date(cookieOptions.expires as string).toUTCString()}`
            if (cookieOptions.secure) cookieString += '; secure'
            if (cookieOptions.sameSite) cookieString += `; samesite=${cookieOptions.sameSite}`
            
            document.cookie = cookieString
          })
        },
      },
    }
  )
}
