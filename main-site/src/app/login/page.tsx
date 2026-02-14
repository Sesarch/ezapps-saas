'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleSecureLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsRedirecting(true)
    
    // Clean and normalize the email input
    const authEmail = email.toLowerCase().trim()

    // 🛡️ STRICT IDENTITY PARTITIONING
    // This logic creates two completely different "tunnels"
    if (authEmail === 'sesarch@yahoo.com') {
      // TUNNEL A: Super Admin Only
      console.log("Identity Verified: Master Admin");
      window.location.replace('/superadmin') 
    } else {
      // TUNNEL B: Standard User Only
      console.log("Identity Verified: Standard Merchant");
      window.location.replace('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid #e2e8f0' }}>
        
        <img src="/logo.png" alt="EZ APPS" style={{ height: '36px', margin: '0 auto 24px', display: 'block' }} />
        <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-0.025em' }}>Enterprise Login</h1>
        
        <form onSubmit={handleSecureLogin} style={{ marginTop: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Login ID</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontWeight: '600' }}
              placeholder="name@company.com"
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Security Key</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontWeight: '600' }}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isRedirecting}
            style={{ 
              width: '100%', 
              padding: '18px', 
              backgroundColor: isRedirecting ? '#94a3b8' : '#0f172a', 
              color: 'white', 
              borderRadius: '14px', 
              border: 'none', 
              fontWeight: '900', 
              textTransform: 'uppercase', 
              cursor: 'pointer', 
              fontSize: '15px',
              transition: 'all 0.2s'
            }}
          >
            {isRedirecting ? 'Verifying Identity...' : 'Authorize Access'}
          </button>
        </form>
      </div>
      
      <p style={{ marginTop: '24px', fontSize: '10px', fontWeight: '900', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
        Secure Gateway Alpha-v2
      </p>
    </div>
  )
}
