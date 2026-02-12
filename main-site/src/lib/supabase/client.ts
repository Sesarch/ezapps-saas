import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  if (typeof window === 'undefined') {
    throw new Error('Supabase browser client should only be used in the browser')
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      cookies: {
        getAll() {
          return document.cookie
            .split('; ')
            .filter(Boolean)
            .map(cookie => {
              const [name, ...rest] = cookie.split('=')
              return { name, value: rest.join('=') }
            })
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = [
              `${name}=${value}`,
              'path=/',
              'domain=.ezapps.app',
              'samesite=lax',
              'secure',
            ]
            
            if (options?.maxAge) {
              cookieOptions.push(`max-age=${options.maxAge}`)
            }
            
            document.cookie = cookieOptions.join('; ')
          })
        },
      },
    }
  )
}
