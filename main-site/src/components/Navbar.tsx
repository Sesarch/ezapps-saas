'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// MUST BE 'export default'
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)

  const products = [
    { name: 'Inventory ERP', desc: 'Global warehouse & stock control.', icon: '📦', slug: 'inventory' },
    { name: 'Loyalty CRM', desc: 'Retention & customer lifecycle.', icon: '🎁', slug: 'loyalty' },
    { name: 'Social Reviews', icon: '⭐', slug: 'reviews' },
    { name: 'Revenue Upsell', icon: '📈', slug: 'upsell' },
    { name: 'Growth Marketing', icon: '📧', slug: 'marketing' },
    { name: 'Data Intelligence', icon: '📝', slug: 'forms' }
  ]

  return (
    <nav className="sticky top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          
          {/* LOGO: Using your logo.png */}
          <Link href="/" className="flex items-center group shrink-0">
            <img src="/logo.png" alt="EZ APPS" className="h-8 w-auto object-contain" />
            <div className="hidden sm:block h-4 w-[2px] bg-slate-300 mx-4" />
            <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-10">
            <div 
              className="relative py-8 cursor-pointer"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <span className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-colors">
                Products <span className="text-[10px] opacity-50">▼</span>
              </span>

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
                        <Link key={item.slug} href={`/products/${item.slug}`} className="group flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all">
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <p className="font-bold text-slate-900 uppercase text-xs tracking-wider">{item.name}</p>
                            <p className="text-xs text-slate-500 mt-1 leading-tight">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/case-studies" className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest">Case Studies</Link>
            <Link href="/pricing" className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest">Pricing</Link>
          </div>

          {/* ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 uppercase tracking-widest">Log In</Link>
            <Link href="/signup" className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 uppercase tracking-widest">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
