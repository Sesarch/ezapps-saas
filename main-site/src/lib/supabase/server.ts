import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const isProduction = process.env.NODE_ENV === 'production'
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          // Get all cookies - they should include domain cookies
          return cookieStore.getAll()
        },
        async setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              // CRITICAL: Always set domain to .ezapps.app in production
              const cookieOptions: Record<string, any> = isProduction
                ? { 
                    ...options,
                    domain: '.ezapps.app',
                    path: '/',
                    sameSite: 'lax' as const,
                    secure: true,
                    httpOnly: false, // Important for client-side access
                  }
                : { 
                    ...options, 
                    path: '/',
                  }
              
              await cookieStore.set(name, value, cookieOptions)
            }
          } catch (error) {
            // Server Component context - cookies already set
            console.log('Cookie set error (expected in Server Component):', error)
          }
        },
      },
    }
  )
}
