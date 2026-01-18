import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Detect if we're in production
  const isProduction = typeof window !== 'undefined' && 
                      !window.location.hostname.includes('localhost') && 
                      !window.location.hostname.includes('127.0.0.1')
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie
            .split('; ')
            .map(cookie => {
              const [name, value] = cookie.split('=')
              return { name, value: decodeURIComponent(value) }
            })
            .filter(cookie => cookie.name && cookie.value)
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set domain to .ezapps.app in production for cross-subdomain access
            const cookieOptions = isProduction
              ? { 
                  ...options, 
                  domain: '.ezapps.app',
                  path: '/',
                  sameSite: 'lax',
                  secure: true,
                }
              : { ...options, path: '/' }
            
            let cookieString = `${name}=${encodeURIComponent(value)}`
            
            if (cookieOptions) {
              if (cookieOptions.domain) cookieString += `; domain=${cookieOptions.domain}`
              if (cookieOptions.path) cookieString += `; path=${cookieOptions.path}`
              if (cookieOptions.maxAge) cookieString += `; max-age=${cookieOptions.maxAge}`
              if (cookieOptions.expires) cookieString += `; expires=${new Date(cookieOptions.expires as string).toUTCString()}`
              if (cookieOptions.secure) cookieString += '; secure'
              if (cookieOptions.sameSite) cookieString += `; samesite=${cookieOptions.sameSite}`
            }
            
            document.cookie = cookieString
          })
        },
      },
    }
  )
}
