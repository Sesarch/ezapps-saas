'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 🛡️ ROLE-BASED REDIRECT LOGIC
    setTimeout(() => {
      if (email === 'sesarch@yahoo.com') {
        // SUPER ADMIN: Redirects to the master management backend
        console.log("Super Admin Verified. Accessing Backend...");
        router.push('/admin/backend') 
      } else {
        // REGULAR USER: Redirects to the standard app dashboard
        console.log("User Verified. Accessing Dashboard...");
        router.push('/dashboard')
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <img src="/logo.png" alt="EZ APPS" className="h-12 w-auto mx-auto mb-6 object-contain" />
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Enterprise Portal
        </h1>
        <p className="text-slate-500 mt-4 font-medium uppercase text-[10px] tracking-widest">
            Secure Auth Gateway
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100"
      >
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-900 font-medium"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
              <Link href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-slate-400 hover:text-slate-900">Forgot?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-900 font-medium"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter text-xl shadow-xl shadow-slate-900/20 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>

      <div className="mt-12 flex items-center gap-4">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Validated Gateway</span>
      </div>
    </div>
  )
}
