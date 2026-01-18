import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production'

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return cookieStore.getAll()
        },
        async setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              // Set domain to .ezapps.app in production for cross-subdomain access
              const cookieOptions: Record<string, any> = isProduction
                ? { 
                    ...options, 
                    domain: '.ezapps.app',
                    path: '/',
                    sameSite: 'lax' as const,
                    secure: true,
                  }
                : { ...options, path: '/' }
              
              cookieStore.set(name, value, cookieOptions)
            }
          } catch {
            // Ignore - called from Server Component
          }
        },
      },
    }
  )
}
