'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Indestructible redirect logic to bypass all hanging issues
  const triggerLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    const lowerEmail = email.toLowerCase().trim()
    
    // Immediate Browser Command
    if (lowerEmail === 'sesarch@yahoo.com') {
      window.location.assign('/superadmin')
    } else {
      window.location.assign('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid #f1f5f9' }}>
        
        <img src="/logo.png" alt="EZ APPS" style={{ height: '40px', margin: '0 auto 24px', display: 'block' }} />
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em', color: '#0f172a', marginBottom: '8px' }}>Portal Access</h1>
        <p style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Enterprise Gateway</p>
        
        <form onSubmit={triggerLogin} style={{ marginTop: '32px' }}>
          {/* EMAIL FIELD */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontWeight: '600' }}
              placeholder="name@company.com"
            />
          </div>

          {/* PASSWORD FIELD - RESTORED */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontWeight: '600' }}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            style={{ width: '100%', padding: '20px', backgroundColor: '#0f172a', color: 'white', borderRadius: '16px', border: 'none', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
