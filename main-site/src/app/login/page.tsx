'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault()
    const userEmail = email.toLowerCase().trim()

    // We use window.location.href to force the browser to move.
    // This ignores any JavaScript "freezes" on the page.
    if (userEmail === 'sesarch@yahoo.com') {
      window.location.href = '/superadmin'
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '32px' }}>ENTERPRISE LOGIN</h1>
        
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ width: '100%', padding: '16px', backgroundColor: '#0f172a', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '900', cursor: 'pointer' }}
          >
            AUTHORIZE ACCESS
          </button>
        </form>
      </div>
    </div>
  )
}
