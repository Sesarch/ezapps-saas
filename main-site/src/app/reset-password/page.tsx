// Custom Forgot Password Implementation
// Use this if Supabase SMTP continues to be flagged as dangerous

// 1. Create API route: /api/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Use Supabase's built-in password reset but ensure it uses our custom redirect
    const supabase = createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      console.error('Supabase reset error:', error)
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 2. Alternative: Full custom implementation with Resend
export async function POST_CUSTOM(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate secure reset token
    const resetToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store token in your database (you'll need to create a password_reset_tokens table)
    const supabase = createClient()
    
    // Check if user exists
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single()

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ success: true })
    }

    // Store reset token (create this table in Supabase)
    await supabase
      .from('password_reset_tokens')
      .insert({
        email,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
        used: false
      })

    // Send email via Resend
    await resend.emails.send({
      from: 'EZ Apps Security <noreply@ezapps.app>',
      to: email,
      subject: 'Reset Your EZ Apps Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>EZ Apps - Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; padding: 40px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 900; margin: 0;">EZ APPS</h1>
                    <p style="color: #64748b; font-size: 12px; margin: 8px 0 0 0;">Enterprise Solutions</p>
                </div>

                <div style="text-align: center; margin-bottom: 32px;">
                    <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 16px 0;">Reset Your Password</h2>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.5;">You requested to reset your password. Click the secure link below to create a new password.</p>
                </div>

                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}" 
                       style="display: inline-block; background-color: #0f172a; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700;">
                        RESET PASSWORD
                    </a>
                </div>

                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                    <p style="color: #475569; font-size: 12px; margin: 0;">
                        <strong>Security Notice:</strong> This link expires in 1 hour. If you didn't request this, ignore this email.
                    </p>
                </div>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                        © 2026 EZ Apps | Enterprise E-commerce Solutions
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Custom forgot password error:', error)
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
  }
}
