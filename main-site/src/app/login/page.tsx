'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // This function uses a direct "window.location" command. 
  // It is the most powerful way to force a browser to change pages.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const userEmail = email.toLowerCase().trim()
    
    if (userEmail === 'sesarch@yahoo.com') {
      // Hard redirect to Super Admin
      window.location.href = '/superadmin'
    } else {
      // Hard redirect to User Dashboard
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid #f1f5f9' }}>
        
        <img src="/logo.png" alt="EZ APPS" style={{ height: '40px', margin: '0 auto 24px', display: 'block' }} />
        <h1 style={{ textAlign: 'center', fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', marginBottom: '32px' }}>Enterprise Login</h1>
        
        <form onSubmit={handleSubmit}>
          {/* EMAIL FIELD */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
              placeholder="sesarch@yahoo.com"
            />
          </div>

          {/* PASSWORD FIELD - RESTORED */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            style={{ width: '100%', padding: '18px', backgroundColor: '#0f172a', color: 'white', borderRadius: '14px', border: 'none', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', fontSize: '16px' }}
          >
            Sign In to Portal
          </button>
        </form>
      </div>
    </div>
  )
}
