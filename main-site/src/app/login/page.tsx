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
    setStatus('Authenticating...')

    // Force a small delay for visual feedback, then HARD REDIRECT
    setTimeout(() => {
      const lowerEmail = email.toLowerCase().trim()
      
      if (lowerEmail === 'sesarch@yahoo.com') {
        setStatus('Accessing SuperAdmin...')
        // Using window.location.assign to force the browser to move
        window.location.assign('/superadmin')
      } else if (lowerEmail === 'sina@usa.com') {
        setStatus('Accessing Dashboard...')
        window.location.assign('/dashboard')
      } else {
        // Fallback for other users
        setStatus('Accessing Dashboard...')
        window.location.assign('/dashboard')
      }
    }, 600)
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
      </motion.div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold"
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
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-lg shadow-xl hover:bg-black transition-all disabled:opacity-50"
          >
            {status}
          </button>
        </form>
      </div>
    </div>
  )
}
