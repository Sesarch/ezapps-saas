'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  const apps = [
    { name: 'Inventory', icon: '📦', label: 'ERP' },
    { name: 'Loyalty', icon: '🎁', label: 'CRM' },
    { name: 'Reviews', icon: '⭐', label: 'Social' },
    { name: 'Upsell', icon: '📈', label: 'Revenue' },
    { name: 'Marketing', icon: '📧', label: 'Growth' },
    { name: 'Forms', icon: '📝', label: 'Data' }
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
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* LEFT: Marketing Copy */}
          <div className="text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full mb-6 border border-green-100"
            >
              <img src="/Shopify.png" alt="Shopify" className="h-5 w-5 object-contain" />
              <span className="text-sm font-bold tracking-wide uppercase">Official Shopify App Suite</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6"
            >
              The Ultimate <span className="text-teal-600">ERP & CRM</span> for Shopify.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Scale your store with 6 elite apps in one dashboard. Real-time inventory intelligence, automated loyalty, and high-performance marketing tools.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/signup" className="px-8 py-4 bg-teal-500 text-white rounded-2xl font-bold text-lg hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/25 hover:scale-105 active:scale-95">
                Start Free Trial
              </Link>
              <Link href="#pricing" className="px-8 py-4 bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all">
                View Pricing
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Modern App Icons Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {apps.map((app, i) => (
                <motion.div
                  key={app.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center text-center"
                >
                  <div className="text-4xl mb-3">{app.icon}</div>
                  <p className="font-bold text-gray-900 text-sm">{app.name}</p>
                  <span className="mt-1 px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded uppercase tracking-widest">
                    {app.label}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* BOTTOM: Upcoming Platforms Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-12 border-t border-gray-100 text-center"
        >
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">More platforms coming soon</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {upcomingPlatforms.map((platform) => (
              <div key={platform.name} className="h-8 lg:h-10 w-auto flex items-center group relative" title={platform.name}>
                <img 
                  src={platform.src} 
                  alt={platform.name} 
                  className="h-full w-auto object-contain transition-transform group-hover:scale-110" 
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
