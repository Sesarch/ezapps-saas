'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6 py-12">
      {/* Brand Identity */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <img src="/logo.png" alt="EZ APPS" className="h-12 w-auto mx-auto mb-6 object-contain" />
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Welcome back</h1>
        <p className="text-slate-500 mt-2 font-medium">Log in to your enterprise dashboard</p>
      </motion.div>

      {/* Login Form Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100"
      >
        <form className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-900 placeholder:text-slate-300 font-medium"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
              <Link href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                Forgot?
              </Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-slate-900 placeholder:text-slate-300 font-medium"
            />
          </div>

          {/* THE UPDATED BUTTON: Now matches Slate-900 theme */}
          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter text-xl shadow-xl shadow-slate-900/20 hover:bg-black transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            New to the platform? {' '}
            <Link href="/signup" className="text-slate-900 font-black hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Security Footer */}
      <div className="mt-12 flex items-center gap-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Secure Session
        </p>
        <div className="h-1 w-1 bg-slate-300 rounded-full" />
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          256-Bit Encryption
        </p>
      </div>
    </div>
  )
}
