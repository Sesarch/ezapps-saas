'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CaseStudiesPage() {
  const cases = [
    {
      company: 'Global Fashion Co.',
      result: '+340% Growth',
      desc: 'How switching to EZ Apps Inventory ERP solved their multi-warehouse syncing issues in 48 hours.',
      tag: 'Logistics',
      gradient: 'from-slate-900 via-slate-800 to-slate-900'
    },
    {
      company: 'Luxury Watch Lab',
      result: '2.5x Retention',
      desc: 'A deep dive into the Loyalty CRM strategies that increased repeat purchases by 150%.',
      tag: 'CRM',
      gradient: 'from-slate-800 via-slate-700 to-slate-800'
    }
  ]

  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none"
          >
            Proven <span className="text-slate-500">Results.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-slate-500 max-w-2xl font-medium"
          >
            Discover how high-volume Shopify merchants scale their infrastructure with EZ Apps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {cases.map((c, i) => (
            <motion.div 
              key={c.company}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* REPLACED GREY BOX WITH GRADIENT */}
              <div className={`aspect-[16/9] bg-gradient-to-br ${c.gradient} rounded-[3rem] mb-8 overflow-hidden relative shadow-2xl shadow-slate-200`}>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                      <span className="text-white/30 font-black text-2xl uppercase tracking-tighter">Enterprise Client</span>
                   </div>
                </div>
                {/* Animated Light Sweep Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              <div className="px-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{c.tag}</span>
                <h3 className="text-3xl font-black text-slate-900 mt-2 mb-4 uppercase tracking-tighter">{c.company}</h3>
                <p className="text-4xl font-black text-slate-900 mb-4">{c.result}</p>
                <p className="text-slate-500 text-lg leading-relaxed mb-6 font-medium">{c.desc}</p>
                <span className="text-slate-900 font-black uppercase text-xs tracking-widest group-hover:underline inline-flex items-center gap-2">
                  Read Full Report <span className="text-[10px]">→</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
