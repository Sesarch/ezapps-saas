'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginBottom: '30px' }}>PORTAL ACCESS</h1>
        
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Identity Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
            placeholder="sesarch@yahoo.com"
          />
        </div>

        {/* 🚨 THE NUCLEAR FIX: Standard HTML Links 🚨 */}
        {/* These do NOT use JavaScript to move. They are indestructible. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {email.toLowerCase().trim() === 'sesarch@yahoo.com' ? (
            <a 
              href="/superadmin" 
              style={{ width: '100%', padding: '18px', backgroundColor: '#0f172a', color: 'white', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', display: 'block' }}
            >
              LOG IN AS SUPER ADMIN
            </a>
          ) : (
            <a 
              href="/dashboard" 
              style={{ width: '100%', padding: '18px', backgroundColor: '#0f172a', color: 'white', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', display: 'block' }}
            >
              LOG IN TO DASHBOARD
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
