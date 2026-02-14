'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const userEmail = email.toLowerCase().trim()
    
    try {
      const supabase = createClient()
      
      // 🛡️ FIXED: Actual Supabase authentication
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!data.user) {
        throw new Error('Authentication failed - no user returned')
      }

      // 🛡️ FIXED: Let the middleware handle the redirect logic
      // For super admin, redirect to superadmin, otherwise dashboard
      if (userEmail === 'sesarch@yahoo.com') {
        window.location.href = '/superadmin'
      } else {
        window.location.href = '/dashboard'
      }
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc', 
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '380px' 
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '20px', 
          fontWeight: '900', 
          color: '#0f172a', 
          marginBottom: '32px' 
        }}>
          ENTERPRISE LOGIN
        </h1>
        
        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleAuth}>
          {/* EMAIL FIELD */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              fontSize: '10px', 
              fontWeight: '900', 
              color: '#64748b', 
              display: 'block', 
              marginBottom: '8px', 
              textTransform: 'uppercase' 
            }}>
              Email Address
            </label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0', 
                boxSizing: 'border-box',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>

          {/* PASSWORD FIELD */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              fontSize: '10px', 
              fontWeight: '900', 
              color: '#64748b', 
              display: 'block', 
              marginBottom: '8px', 
              textTransform: 'uppercase' 
            }}>
              Password
            </label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0', 
                boxSizing: 'border-box',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>
          
          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: loading ? '#64748b' : '#0f172a', 
              color: 'white', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: '900', 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {loading ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div style={{ 
          marginTop: '24px', 
          textAlign: 'center', 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: '20px' 
        }}>
          <a 
            href="/forgot-password"
            style={{ 
              fontSize: '12px', 
              color: '#64748b', 
              textDecoration: 'none',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#0f172a'
              e.currentTarget.style.textDecoration = 'underline'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#64748b'
              e.currentTarget.style.textDecoration = 'none'
            }}
          >
            Forgot Password?
          </a>
        </div>
      </div>
      
      {/* Add spin animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  )
}
