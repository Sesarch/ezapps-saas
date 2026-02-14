'use client'

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: '900' }}>SECURITY PORTAL</h2>
        
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <input 
            id="email_field"
            type="email" 
            placeholder="Email"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <input 
            id="pass_field"
            type="password" 
            placeholder="Password"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>
        
        <button 
          type="button"
          onClick={() => {
            const email = (document.getElementById('email_field') as HTMLInputElement).value;
            if (email.toLowerCase().trim() === 'sesarch@yahoo.com') {
              window.location.href = '/superadmin';
            } else {
              window.location.href = '/dashboard';
            }
          }}
          style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          AUTHORIZE ACCESS
        </button>
      </div>
    </div>
  )
}
