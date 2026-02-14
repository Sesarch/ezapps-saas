'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    
    // We use a strictly defined constant to prevent any logic leaks
    const input = email.toLowerCase().trim()

    if (input === 'sesarch@yahoo.com') {
      // FORCED ADMIN PATH
      alert("ADMIN DETECTED - ROUTING TO SUPERADMIN")
      window.location.replace('/superadmin')
    } else {
      // FORCED USER PATH
      alert("USER DETECTED - ROUTING TO DASHBOARD")
      window.location.replace('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid #e2e8f0' }}>
        
        <img src="/logo.png" alt="EZ APPS" style={{ height: '36px', margin: '0 auto 24px', display: 'block' }} />
        <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', marginBottom: '32px' }}>Security Checkpoint</h2>
        
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Identity Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Security Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ width: '100%', padding: '18px', backgroundColor: '#0f172a', color: 'white', borderRadius: '14px', border: 'none', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Authorize Entry
          </button>
        </form>
      </div>
    </div>
  )
}
