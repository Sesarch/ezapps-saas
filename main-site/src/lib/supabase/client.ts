import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  if (typeof window === 'undefined') {
    throw new Error('Supabase browser client should only be used in the browser')
  }

  // Use default cookie handling - no custom config needed
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
