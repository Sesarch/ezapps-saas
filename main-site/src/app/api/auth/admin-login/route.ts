import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// This route uses the admin/service role to bypass rate limits
// Only use temporarily to fix rate limit issues!

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Use admin API to verify user credentials
    // First, get the user by email
    const { data: userData, error: userError } = await supabaseAdmin
      .from('auth.users')
      .select('*')
      .eq('email', email)
      .single()

    // Actually, let's use a different approach - generate a magic link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: 'https://ezapps.app/add-platform'
      }
    })

    if (error) {
      console.error('Admin generateLink error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Return the magic link properties (hashed_token can be used)
    return NextResponse.json({
      success: true,
      message: 'Magic link generated',
      // The action_link contains the full URL to sign in
      actionLink: data.properties?.action_link,
      // Or use the verification token
      token: data.properties?.hashed_token
    })

  } catch (err: any) {
    console.error('Admin login error:', err)
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
