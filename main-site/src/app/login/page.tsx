'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid #e2e8f0' }}>
        <img src="/logo.png" alt="EZ APPS" style={{ height: '40px', margin: '0 auto 24px', display: 'block' }} />
        <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', textAlign: 'center', textTransform: 'uppercase' }}>Portal Access</h1>
        
        <div style={{ marginTop: '24px' }}>
          <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', boxSizing: 'border-box' }} placeholder="sesarch@yahoo.com" />
          
          <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px', boxSizing: 'border-box' }} placeholder="••••••••" />
        </div>

        {email.toLowerCase().trim() === 'sesarch@yahoo.com' ? (
          <a href="/superadmin" style={{ width: '100%', padding: '18px', backgroundColor: '#0f172a', color: 'white', borderRadius: '14px', fontWeight: '900', textDecoration: 'none', display: 'block', textAlign: 'center' }}>LOG IN AS ADMIN</a>
        ) : (
          <a href="/dashboard" style={{ width: '100%', padding: '18px', backgroundColor: '#1e293b', color: 'white', borderRadius: '14px', fontWeight: '900', textDecoration: 'none', display: 'block', textAlign: 'center' }}>LOG IN AS USER</a>
        )}
      </div>
    </div>
  )
}
