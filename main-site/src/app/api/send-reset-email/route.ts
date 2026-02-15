import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Create Supabase client for API route
    const supabase = createRouteHandlerClient({ cookies })
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ezapps.app'}/reset-password`,
    })

    if (error) {
      console.error('Supabase reset error:', error)
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
    }

    // Send our own clean email via Resend
    try {
      await resend.emails.send({
        from: 'EZ Apps <noreply@ezapps.app>',
        to: email,
        subject: 'Reset Your EZ Apps Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0f172a; font-size: 24px;">EZ APPS</h1>
              <p style="color: #64748b;">Enterprise Solutions</p>
            </div>
            
            <h2 style="color: #0f172a;">Reset Your Password</h2>
            <p>You requested to reset your password. Use the link we just sent to your email to reset it securely.</p>
            
            <p style="background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 14px; color: #64748b;">
              <strong>Security Note:</strong> This request expires in 1 hour. If you didn't request this, ignore this email.
            </p>
            
            <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
              © 2026 EZ Apps | Enterprise E-commerce Solutions
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Resend error:', emailError)
      // Don't fail the request if our email fails
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
