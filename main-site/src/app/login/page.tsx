'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('Sign In')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const userEmail = email.toLowerCase().trim()
    console.log("Attempting login for:", userEmail)

    // FORCE REDIRECT - This bypasses the Next.js Router to prevent hanging
    if (userEmail === 'sesarch@yahoo.com') {
      setStatus('Redirecting to Admin...')
      // A "Hard" redirect that the browser cannot ignore
      window.location.href = '/superadmin' 
    } else if (userEmail === 'sina@usa.com') {
      setStatus('Redirecting to Dashboard...')
      window.location.href = '/dashboard'
    } else {
      setStatus('Redirecting...')
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <img src="/logo.png" alt="EZ APPS" className="h-10 w-auto mx-auto mb-6" />
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Enterprise Portal</h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Secure Gateway</p>
      </motion.div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-slate-900/5 outline-none"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-slate-900/5 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-lg shadow-xl hover:bg-black transition-all disabled:bg-slate-400"
          >
            {status}
          </button>
        </form>
      </div>
    </div>
  )
}
