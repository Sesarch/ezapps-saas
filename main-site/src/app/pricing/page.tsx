'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const apps = [
    { name: 'Inventory ERP', icon: '📦' },
    { name: 'Loyalty CRM', icon: '🎁' },
    { name: 'Social Reviews', icon: '⭐' },
    { name: 'Revenue Upsell', icon: '📈' },
    { name: 'Growth Marketing', icon: '📧' },
    { name: 'Data Intelligence', icon: '📝' }
  ]

  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* HEADER SECTION */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter"
        >
          Simple <span className="text-slate-500">Pricing.</span>
        </motion.h1>
        
        <p className="text-2xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium">
          Enterprise infrastructure designed for high-volume scale.
        </p>

        {/* TOGGLE OPTION: Monthly vs Yearly */}
        <div className="flex items-center justify-center gap-6 mb-20">
          <span className={`text-sm font-black uppercase tracking-widest ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-20 h-10 bg-slate-900 rounded-full p-1 relative transition-all"
          >
            <motion.div 
              animate={{ x: isYearly ? 40 : 0 }}
              className="w-8 h-8 bg-white rounded-full shadow-lg"
            />
          </button>
          <div className="flex flex-col items-start">
            <span className={`text-sm font-black uppercase tracking-widest ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Save ~40%</span>
          </div>
        </div>

        {/* PRICING TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* THE ALL-ACCESS PASS (New Yearly Option) */}
          <div className="md:col-span-3 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border border-slate-800 shadow-2xl">
            <div className="text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">Enterprise Exclusive</span>
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">EZ Apps Full Suite</h2>
              <p className="text-slate-400 font-medium">Unlock all 6 apps for one annual price.</p>
            </div>
            <div className="text-center md:text-right">
              <div className="text-6xl font-black tracking-tighter mb-2">
                {isYearly ? '$499' : '$349'}<span className="text-2xl text-slate-500">/{isYearly ? 'Y' : 'M'}</span>
              </div>
              <Link href="/signup" className="inline-block px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                Get All Apps Now
              </Link>
            </div>
          </div>

          {/* INDIVIDUAL APP CARDS */}
          {apps.map((app) => (
            <div key={app.name} className="p-10 border border-slate-100 rounded-[2.5rem] bg-slate-50/50 hover:bg-white transition-all group hover:shadow-2xl hover:shadow-slate-200">
              <div className="text-4xl mb-6">{app.icon}</div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{app.name}</h3>
              <div className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">
                $69<span className="text-sm text-slate-400 uppercase">/m</span>
              </div>
              <ul className="space-y-4 mb-10 text-left">
                <li className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="text-teal-500">✔</span> Unlimited Volume
                </li>
                <li className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="text-teal-500">✔</span> Priority Support
                </li>
              </ul>
              <Link href="/signup" className="block w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all">
                Sign Up
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
