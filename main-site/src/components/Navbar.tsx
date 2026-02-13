'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close menus on resize to prevent layout glitches
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const products = [
    { name: 'Inventory ERP', desc: 'Global warehouse & stock control.', icon: '📦', slug: 'inventory' },
    { name: 'Loyalty CRM', desc: 'Retention & customer lifecycle.', icon: '🎁', slug: 'loyalty' },
    { name: 'Social Reviews', desc: 'Trust & proof automation.', icon: '⭐', slug: 'reviews' },
    { name: 'Revenue Upsell', icon: '📈', slug: 'upsell', desc: 'AI-driven profit optimization.' },
    { name: 'Growth Marketing', icon: '📧', slug: 'marketing', desc: 'Automated multi-channel flows.' },
    { name: 'Data Intelligence', icon: '📝', slug: 'forms', desc: 'Enterprise analytics & forms.' }
  ]

  return (
    // 'sticky top-0' ensures the header stays fixed on all pages
    <nav className="sticky top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          
          {/* LOGO SECTION */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">EZ APPS</span>
            <div className="hidden sm:block h-4 w-[2px] bg-slate-300" />
            <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise</span>
          </Link>

          {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-10">
            <div 
              className="relative py-8 cursor-pointer"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <span className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 uppercase tracking-widest transition-colors">
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

            <Link href="/case-studies" className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-colors">Case Studies</Link>
            <Link href="/pricing" className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-colors">Pricing</Link>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 uppercase tracking-widest">Log In</Link>
            <Link href="/signup" className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 uppercase tracking-widest">
              Get Started
            </Link>
          </div>

          {/* HAMBURGER BUTTON (Mobile Only) */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-900 focus:outline-none"
            >
              <div className="w-6 h-0.5 bg-slate-900 mb-1.5 transition-all"></div>
              <div className="w-6 h-0.5 bg-slate-900 mb-1.5 transition-all"></div>
              <div className="w-6 h-0.5 bg-slate-900 transition-all"></div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-slate-200 overflow-hidden md:hidden shadow-2xl"
          >
            <div className="p-6 space-y-8">
              {/* Mobile Products List */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Our Ecosystem</p>
                <div className="grid grid-cols-1 gap-4">
                  {products.map((item) => (
                    <Link 
                      key={item.slug} 
                      href={`/products/${item.slug}`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-bold text-slate-900 uppercase text-xs tracking-wider">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                <Link href="/case-studies" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-900 uppercase tracking-tight">Case Studies</Link>
                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-900 uppercase tracking-tight">Pricing</Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-900 uppercase tracking-tight">Log In</Link>
              </div>

              {/* Mobile CTA */}
              <Link 
                href="/signup" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-black uppercase tracking-tighter text-xl shadow-xl shadow-slate-900/20"
              >
                Get Started Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
