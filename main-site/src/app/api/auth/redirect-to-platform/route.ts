import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const platform = searchParams.get('platform')

  if (!platform) {
    return NextResponse.json({ error: 'Platform not specified' }, { status: 400 })
  }

  // Verify user is authenticated
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Get the access token from the session
  const accessToken = session.access_token
  const refreshToken = session.refresh_token

  // Redirect to platform subdomain with tokens in URL
  const redirectUrl = process.env.NODE_ENV === 'production'
    ? `https://${platform}.ezapps.app/auth/callback-subdomain?access_token=${accessToken}&refresh_token=${refreshToken}`
    : `http://localhost:3000/dashboard`

  return NextResponse.redirect(redirectUrl)
}
