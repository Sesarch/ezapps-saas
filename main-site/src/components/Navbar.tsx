'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)

  const products = [
    { name: 'Inventory ERP', desc: 'Global warehouse & stock control.', icon: '📦', slug: 'inventory' },
    { name: 'Loyalty CRM', desc: 'Retention & customer lifecycle.', icon: '🎁', slug: 'loyalty' },
    { name: 'Social Reviews', desc: 'Trust & proof automation.', icon: '⭐', slug: 'reviews' },
    { name: 'Revenue Upsell', desc: 'AI-driven profit optimization.', icon: '📈', slug: 'upsell' },
    { name: 'Growth Marketing', desc: 'Automated multi-channel flows.', icon: '📧', slug: 'marketing' },
    { name: 'Data Intelligence', desc: 'Enterprise analytics & forms.', icon: '📝', slug: 'forms' }
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">EZ APPS</span>
            <div className="h-4 w-[2px] bg-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Enterprise</span>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-10">
            <div 
              className="relative py-8 cursor-pointer"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <span className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 uppercase tracking-widest">
                Products <span className="text-[10px]">▼</span>
              </span>

              {/* MEGA MENU */}
              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden p-8"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {products.map((item) => (
                        <Link 
                          key={item.slug} 
                          href={`/products/${item.slug}`}
                          className="group flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all"
                        >
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-slate-900 uppercase text-xs tracking-wider">{item.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unified Shopify Ecosystem</p>
                      <Link href="/signup" className="text-xs font-black text-slate-900 hover:underline">Explore All Solutions →</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/case-studies" className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest">Case Studies</Link>
            <Link href="/pricing" className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest">Pricing</Link>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 uppercase tracking-widest">Log In</Link>
            <Link href="/signup" className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 uppercase tracking-widest">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
