import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 401 }
      )
    }

    // Create response
    const response = NextResponse.json({ 
      success: true, 
      user: data.user 
    })

    // CRITICAL: Set auth cookies in the response
    const cookieStore = await cookies()
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Set access token cookie
    response.cookies.set({
      name: `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
      value: JSON.stringify(data.session),
      domain: isProduction ? '.ezapps.app' : undefined,
      path: '/',
      sameSite: 'lax',
      secure: isProduction,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
    
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
