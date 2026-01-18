import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')

  if (!accessToken || !refreshToken) {
    // No tokens provided, redirect to main domain login
    return NextResponse.redirect('https://ezapps.app/login')
  }

  // Create Supabase client
  const supabase = await createClient()

  // Set the session using the tokens
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (error) {
    console.error('Error setting session:', error)
    return NextResponse.redirect('https://ezapps.app/login')
  }

  // Session set successfully! Redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
