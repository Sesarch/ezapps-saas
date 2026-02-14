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
      features: ['Multi-warehouse Sync', 'Real-time Stock Tracking', 'Automated Purchase Orders', 'SKU Management']
    },
    {
      name: 'Loyalty CRM',
      icon: '🎁',
      features: ['VIP Tiering System', 'Points-to-Discount Engine', 'Customer Segmenting', 'Birthday Automations']
    },
    {
      name: 'Social Reviews',
      icon: '⭐',
      features: ['Photo & Video Reviews', 'Automatic Review Requests', 'Google Shopping Integration', 'SEO Snippets']
    },
    {
      name: 'Revenue Upsell',
      icon: '📈',
      features: ['In-Cart Recommendations', 'Post-Purchase Upsells', 'Bundle & Save Logic', 'A/B Testing']
    },
    {
      name: 'Growth Marketing',
      icon: '📧',
      features: ['Sms & Email Flows', 'Abandoned Cart Recovery', 'Win-back Campaigns', 'Subscriber Pop-ups']
    },
    {
      name: 'Data Intelligence',
      icon: '📝',
      features: ['Custom Post-Purchase Surveys', 'Form Builder', 'Zero-party Data Tracking', 'Export to CSV/Klaviyo']
    }
  ]

  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER & TOGGLE */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter"
          >
            One Price. <span className="text-slate-500">All Apps.</span>
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
            <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
              The Enterprise Bundle
            </span>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Complete Commerce Suite</h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter">
                {isYearly ? '$499' : '$69'}
              </span>
              <div className="text-left">
                <p className="text-2xl font-black text-slate-400 uppercase leading-none">/{isYearly ? 'Year' : 'Month'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">for all 6 apps</p>
              </div>
            </div>
            
            <Link href="/signup" className="block w-full max-w-md mx-auto py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xl tracking-tighter shadow-xl shadow-slate-900/20 hover:bg-black transition-all">
              Start Your Free Trial
            </Link>
          </div>
        </div>

        {/* DETAILED FEATURE EXPLANATION */}
        <div className="border-t border-slate-100 pt-20">
            <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-20">Included Enterprise Infrastructure</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
              {appFeatures.map((app) => (
                <div key={app.name} className="flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{app.icon}</span>
                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{app.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {app.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        {/* Green Checkmark */}
                        <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-600 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* TRUST FOOTER */}
        <div className="mt-32 text-center p-12 bg-slate-50 rounded-[3rem] border border-slate-100">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Enterprise Security</p>
           <p className="text-slate-500 font-medium">All plans include 256-bit encryption, SOC2 Type II compliance, and 24/7 priority support for high-volume merchants.</p>
        </div>
      </div>
    </div>
  )
}
