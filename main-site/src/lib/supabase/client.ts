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

        /**
         * 🔥 CRITICAL FIX
         * Use localStorage instead of cookies
         * This fixes:
         * - password reset hanging
         * - subdomain auth issues
         * - updateUser never resolving
         */
        storage: window.localStorage,

        /**
         * Optional but recommended
         */
        flowType: 'pkce',
      },
    }
  )
}
