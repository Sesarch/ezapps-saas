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
      // High-end warehouse/logistics imagery
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop'
    },
    {
      company: 'Luxury Watch Lab',
      result: '2.5x Retention',
      desc: 'A deep dive into the Loyalty CRM strategies that increased repeat purchases by 150%.',
      tag: 'CRM',
      // Luxury retail/tech interface imagery
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {cases.map((c, i) => (
            <motion.div 
              key={c.company}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* IMAGE CONTAINER */}
              <div className="aspect-[16/9] bg-slate-100 rounded-[3rem] mb-8 overflow-hidden relative shadow-2xl shadow-slate-200">
                <img 
                  src={c.image} 
                  alt={c.company}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                
                <div className="absolute bottom-8 left-8">
                   <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full">
                      <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Enterprise Case 0{i + 1}</span>
                   </div>
                </div>
              </div>

              <div className="px-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{c.tag}</span>
                <h3 className="text-3xl font-black text-slate-900 mt-2 mb-4 uppercase tracking-tighter">{c.company}</h3>
                <p className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{c.result}</p>
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
