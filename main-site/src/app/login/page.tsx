'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')

  // We are using a standard HTML function to guarantee execution
  const triggerLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    const lowerEmail = email.toLowerCase().trim()
    
    // This is the most direct way to move a user in a web browser
    if (lowerEmail === 'sesarch@yahoo.com') {
      alert("Redirecting to Super Admin...")
      window.location.assign('/superadmin')
    } else {
      alert("Redirecting to Dashboard...")
      window.location.assign('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid #f1f5f9' }}>
        <img src="/logo.png" alt="EZ APPS" style={{ height: '40px', margin: '0 auto 24px', display: 'block' }} />
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em', color: '#0f172a' }}>Portal Access</h1>
        
        <form onSubmit={triggerLogin} style={{ marginTop: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
              placeholder="name@company.com"
            />
          </div>
          
          <button 
            type="submit" 
            style={{ width: '100%', padding: '16px', backgroundColor: '#0f172a', color: 'white', borderRadius: '12px', border: 'none', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', fontSize: '16px' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
