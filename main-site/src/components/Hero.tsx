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

  const upcomingPlatforms = [
    { name: 'WooCommerce', src: '/wooCommerce.png' },
    { name: 'Wix', src: '/Wix.png' },
    { name: 'BigCommerce', src: '/BigCommerce.png' },
    { name: 'Squarespace', src: '/squarespace.png' },
    { name: 'Magento', src: '/MagentoCommerce.png' },
    { name: 'OpenCart', src: '/opencart.png' },
    { name: 'Etsy', src: '/etsy.png' },
    { name: 'Amazon', src: '/amazon.png' }
  ]

  return (
    <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-40 overflow-hidden bg-[#f8fafc]">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* 2. Centered Badge for Mobile */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col sm:flex-row items-center gap-6 mb-12 justify-center lg:justify-start"
            >
              <img src="/Shopify.png" alt="Shopify" className="h-16 w-auto object-contain" />
              <div className="hidden sm:block h-12 w-[2px] bg-slate-300 mx-2" />
              <span className="text-xl lg:text-2xl font-black text-slate-800 uppercase tracking-tight text-center">
                Enterprise Solutions Partner
              </span>
            </motion.div>

            <motion.h1 className="text-5xl lg:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter">
              Unified Commerce. <br/>
              <span className="text-slate-500">Global Scale.</span>
            </motion.h1>

            <motion.p className="text-lg lg:text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              EZ Apps provides the mission-critical infrastructure for high-volume Shopify merchants. Integrate ERP, CRM, and automated marketing into a single, secure ecosystem.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/signup" className="px-10 py-5 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                Book Enterprise Demo
              </Link>
              <Link href="/case-studies" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                Read Case Studies
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {apps.map((app) => (
                <Link href={app.path} key={app.name}>
                  <motion.div
                    whileHover={{ scale: 1.02, backgroundColor: '#ffffff' }}
                    className="group p-8 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all cursor-pointer"
                  >
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{app.icon}</div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{app.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-900">Explore Solution →</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Platforms Coming Soon Section */}
        <div className="mt-32 pt-16 border-t border-slate-200">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">More Platforms Coming Soon</p>
          <div className="flex flex-wrap justify-center items-end gap-x-12 gap-y-16">
            {upcomingPlatforms.map((platform) => (
              <div key={platform.name} className="flex flex-col items-center gap-4 group">
                <div className="h-8 lg:h-10 w-auto flex items-center grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500">
                  <img src={platform.src} alt={platform.name} className="h-full w-auto object-contain" />
                </div>
                <span style={{ color: '#E7E7E7' }} className="text-[10px] font-black uppercase tracking-widest">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
