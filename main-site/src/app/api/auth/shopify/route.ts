// src/app/api/auth/shopify/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
    return (await cookieStore).getAll()
  },
  async setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
    const store = await cookieStore
    cookiesToSet.forEach(({ name, value, options }) =>
      store.set(name, value, options)
    )
  },
}
    }
  )

  // Your Shopify OAuth logic here
  // Example:
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'shopify',
    options: {
      redirectTo: `${origin}/api/auth/shopify/callback`,
    },
  })

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  return NextResponse.redirect(data.url)
}
