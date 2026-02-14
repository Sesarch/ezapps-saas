'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    
    const input = email.toLowerCase().trim()

    // We use window.location.replace to kill the current page 
    // and force the browser to move instantly.
    if (input === 'sesarch@yahoo.com') {
      window.location.replace('/superadmin')
    } else {
      window.location.replace('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '32px' }}>PORTAL ACCESS</h1>
        
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>EMAIL</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'block' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>PASSWORD</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'block' }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ width: '100%', padding: '14px', backgroundColor: '#0f172a', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  )
}
