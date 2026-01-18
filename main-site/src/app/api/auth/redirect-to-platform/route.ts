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
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Get the session to pass along
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to platform subdomain with session
  const redirectUrl = process.env.NODE_ENV === 'production'
    ? `https://${platform}.ezapps.app/dashboard`
    : `http://localhost:3000/dashboard`

  // Create response with session cookies properly set for subdomain
  const response = NextResponse.redirect(redirectUrl)

  // The cookies are already set by the createClient call above with the correct domain
  // Just redirect - the middleware will handle the session

  return response
}
