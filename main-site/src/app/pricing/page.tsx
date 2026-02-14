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
      features: [
        'Multi-warehouse Sync & Routing',
        'Real-time Stock Tracking (Global)',
        'Automated Purchase Order Workflows',
        'Barcode & QR Label Generation',
        'Landed Cost & Profit Margin Calc',
        'Bulk SKU Import/Export Tools'
      ]
    },
    {
      name: 'Loyalty CRM',
      icon: '🎁',
      features: [
        'Custom VIP Tiering System',
        'Points-to-Discount Logic Engine',
        'Referral Tracking & Analytics',
        'Automated Birthday/Holiday Rewards',
        'Omnichannel POS Integration',
        'Customer Lifetime Value (CLV) Data'
      ]
    },
    {
      name: 'Social Reviews',
      icon: '⭐',
      features: [
        'High-Res Photo & Video Reviews',
        'On-site Q&A Community Sections',
        'Google Shopping Ads Integration',
        'Rich Snippets for Search SEO',
        'Review Incentive Automation',
        'Social Media Auto-Posting'
      ]
    },
    {
      name: 'Revenue Upsell',
      icon: '📈',
      features: [
        'AI-Driven In-Cart Recommendations',
        'One-Click Post-Purchase Upsells',
        'Dynamic Bundle & Save Logic',
        'Real-time A/B Testing Engine',
        'Smart Discount Scheduling',
        'Mobile-Optimized Checkout Layouts'
      ]
    },
    {
      name: 'Growth Marketing',
      icon: '📧',
      features: [
        'Unlimited SMS & Email Flows',
        'High-Volume Cart Recovery',
        'Automated Win-back Campaigns',
        'Drag-and-Drop Pop-up Builder',
        'Omnichannel Subscriber Sync',
        'Advanced Segmentation Logic'
      ]
    },
    {
      name: 'Data Intelligence',
      icon: '📝',
      features: [
        'Post-Purchase Attribution Surveys',
        'Custom Form & Quiz Builder',
        'Zero-party Data Tracking',
        'Direct Klaviyo & Gorgias Sync',
        'Real-time Revenue Attribution',
        'Custom CSV Export Schedules'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6"
          >
            Unified Enterprise Solution
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-9xl font-black text-slate-900 mb-6 uppercase tracking-tighter"
          >
            One Price. <br/>
            <span className="text-slate-300 font-outline">Full Suite.</span>
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
            <div className="flex flex-col items-start text-left">
              <span className={`text-sm font-black uppercase tracking-widest ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Save ~40%</span>
            </div>
          </div>
        </div>

        {/* PRIMARY PRICING CARD */}
        <div className="relative p-1 bg-gradient-to-b from-slate-200 to-transparent rounded-[3.5rem] mb-32 max-w-4xl mx-auto">
          <div className="bg-white rounded-[3.4rem] p-12 lg:p-20 text-center shadow-2xl">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">The EZ Apps Bundle</h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-8xl lg:text-[10rem] font-black text-slate-900 tracking-tighter leading-none">
                {isYearly ? '$499' : '$69'}
              </span>
              <div className="text-left">
                <p className="text-3xl font-black text-slate-400 uppercase leading-none">/{isYearly ? 'Y' : 'M'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">All 6 Apps Included</p>
              </div>
            </div>
            
            <Link href="/signup" className="block w-full max-w-md mx-auto py-7 bg-slate-900 text-white rounded-2xl font-black uppercase text-xl tracking-tighter shadow-xl shadow-slate-900/30 hover:bg-black transition-all">
              Start Free 14-Day Trial
            </Link>
          </div>
        </div>

        {/* EXPANDED FEATURE LISTS */}
        <div className="border-t border-slate-100 pt-24">
            <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-24">Mission-Critical Capabilities</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {appFeatures.map((app) => (
                <div key={app.name} className="flex flex-col group">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">{app.icon}</span>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{app.name}</h4>
                  </div>
                  <div className="space-y-4">
                    {app.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-500 font-semibold text-xs uppercase tracking-tight leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* TRUST SIGNALS */}
        <div className="mt-40 text-center border-t border-slate-100 pt-20">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div>
               <p className="text-sm font-black text-slate-900 uppercase mb-2">SOC2 Type II</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance</p>
             </div>
             <div>
               <p className="text-sm font-black text-slate-900 uppercase mb-2">99.9% Uptime</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLA Guarantee</p>
             </div>
             <div>
               <p className="text-sm font-black text-slate-900 uppercase mb-2">Global CDN</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Latency</p>
             </div>
             <div>
               <p className="text-sm font-black text-slate-900 uppercase mb-2">24/7 Priority</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Support</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
