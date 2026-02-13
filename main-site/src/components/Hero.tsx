'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  const apps = [
    { name: 'Inventory ERP', icon: '📦', path: '/products/inventory' },
    { name: 'Loyalty CRM', icon: '🎁', path: '/products/loyalty' },
    { name: 'Social Reviews', icon: '⭐', path: '/products/reviews' },
    { name: 'Revenue Upsell', icon: '📈', path: '/products/upsell' },
    { name: 'Growth Marketing', icon: '📧', path: '/products/marketing' },
    { name: 'Data Intelligence', icon: '📝', path: '/products/forms' }
  ]

  return (
    <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-40 overflow-hidden bg-white">
      {/* Background: Clean, minimal grid to match Case Studies */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          
          <div className="lg:col-span-7">
            {/* TRUST BADGE: Minimalist Corporate Style */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex flex-col gap-6 mb-16"
            >
              <div className="flex items-center gap-6">
                <img src="/Shopify.png" alt="Shopify" className="h-16 w-auto grayscale brightness-50 contrast-125" />
                <div className="h-10 w-[1px] bg-slate-200" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Enterprise Partner</span>
              </div>

              {/* UNIFIED APP STRIP: Glass-morphism to match Navbar */}
              <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl w-fit">
                {apps.map((app) => (
                  <div key={app.name} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100/50 text-lg grayscale hover:grayscale-0 transition-all cursor-help" title={app.name}>
                    {app.icon}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.h1 className="text-6xl lg:text-9xl font-black text-slate-900 leading-[0.85] mb-10 tracking-tighter uppercase">
              Unified <br/>
              <span className="text-slate-300">Commerce.</span>
            </motion.h1>

            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium">
              EZ Apps provides mission-critical infrastructure for the world's most demanding Shopify merchants.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link href="/signup" className="px-12 py-6 bg-slate-900 text-white rounded-2xl font-black text-lg uppercase tracking-tighter hover:bg-black transition-all shadow-2xl shadow-slate-900/20">
                Book Enterprise Demo
              </Link>
              <Link href="/case-studies" className="px-12 py-6 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-lg uppercase tracking-tighter hover:bg-slate-50 transition-all">
                Case Studies
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Minimalist feature cards */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="grid grid-cols-1 gap-6">
              {apps.slice(0, 3).map((app) => (
                <div key={app.name} className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/30 backdrop-blur-sm group hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-6">
                    <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">{app.icon}</span>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-tight">{app.name}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Enterprise Ready →</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
