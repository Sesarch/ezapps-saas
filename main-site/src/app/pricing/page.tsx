'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const appFeatures = [
    {
      name: 'Inventory ERP',
      icon: '📦',
      features: ['Multi-warehouse Sync', 'Real-time Stock Tracking', 'Automated POs', 'Barcode Scanning', 'Landed Cost Calc']
    },
    {
      name: 'Loyalty CRM',
      icon: '🎁',
      features: ['VIP Tiering', 'Points Engine', 'Referral Tracking', 'Birthday Rewards', 'POS Integration']
    },
    {
      name: 'Social Reviews',
      icon: '⭐',
      features: ['Photo & Video Reviews', 'Q&A Sections', 'Google Shopping', 'SEO Snippets', 'Review Incentives']
    },
    {
      name: 'Revenue Upsell',
      icon: '📈',
      features: ['In-Cart Recommendations', 'Post-Purchase Upsells', 'Bundle Logic', 'A/B Testing', 'Smart Discounts']
    },
    {
      name: 'Growth Marketing',
      icon: '📧',
      features: ['SMS & Email Flows', 'Cart Recovery', 'Win-back Campaigns', 'Pop-up Builder', 'Omnichannel Sync']
    },
    {
      name: 'Data Intelligence',
      icon: '📝',
      features: ['Post-Purchase Surveys', 'Form Builder', 'Zero-party Data', 'Klaviyo Sync', 'Advanced Analytics']
    }
  ]

  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER & TOGGLE */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6"
          >
            Limited Time: 14-Day Free Trial
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter"
          >
            Unified <span className="text-slate-500">Value.</span>
          </motion.h1>
          
          <div className="flex items-center justify-center gap-6 mt-12">
            <span className={`text-sm font-black uppercase tracking-widest ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 bg-slate-900 rounded-full p-1 relative"
            >
              <motion.div 
                animate={{ x: isYearly ? 32 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
            <div className="flex flex-col items-start">
              <span className={`text-sm font-black uppercase tracking-widest ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Save 40%</span>
            </div>
          </div>
        </div>

        {/* MAIN PRICING CARD */}
        <div className="relative p-1 bg-gradient-to-b from-slate-200 to-transparent rounded-[3.5rem] mb-24">
          <div className="bg-white rounded-[3.4rem] p-12 lg:p-16 text-center shadow-2xl">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Complete Commerce Suite</h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter">
                {isYearly ? '$499' : '$69'}
              </span>
              <div className="text-left">
                <p className="text-2xl font-black text-slate-400 uppercase leading-none">/{isYearly ? 'Year' : 'Month'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Full Access to 6 Apps</p>
              </div>
            </div>
            
            <Link href="/signup" className="block w-full max-w-md mx-auto py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xl tracking-tighter shadow-xl shadow-slate-900/20 hover:bg-black transition-all">
              Start Free Trial
            </Link>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">No credit card required to start</p>
          </div>
        </div>

        {/* NEW: ADD-ON / ENTERPRISE OPTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">White-Glove Migration</h4>
            <p className="text-slate-500 text-sm mb-6">Moving from another platform? Our team will migrate all your reviews, inventory, and CRM data for you.</p>
            <span className="text-xs font-black text-slate-900 uppercase">Included in Annual Plan →</span>
          </div>
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">API & Webhooks</h4>
            <p className="text-slate-500 text-sm mb-6">Build custom integrations with our robust REST API and real-time webhooks for your headless store.</p>
            <span className="text-xs font-black text-slate-900 uppercase">Enterprise Standard →</span>
          </div>
        </div>

        {/* DETAILED FEATURE EXPLANATION */}
        <div className="border-t border-slate-100 pt-20">
            <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-20">Full Feature Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
              {appFeatures.map((app) => (
                <div key={app.name} className="flex flex-col group">
                  <div className="flex items-center gap-4 mb-6 transition-transform group-hover:translate-x-2">
                    <span className="text-4xl">{app.icon}</span>
                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{app.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {app.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-600 font-medium text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* EXPANDED TRUST SECTION */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-slate-100 pt-20">
           <div>
             <p className="text-3xl mb-4">🛡️</p>
             <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">SOC2 Type II</h5>
             <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">Enterprise Grade Security</p>
           </div>
           <div>
             <p className="text-3xl mb-4">📞</p>
             <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">24/7 Support</h5>
             <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">Avg. Response: 12 Mins</p>
           </div>
           <div>
             <p className="text-3xl mb-4">⚡</p>
             <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">Global CDN</h5>
             <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">Zero Impact on Load Times</p>
           </div>
        </div>
      </div>
    </div>
  )
}
