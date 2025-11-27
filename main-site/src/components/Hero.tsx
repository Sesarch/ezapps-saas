'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-turquoise-light/20 via-white to-peach-light/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Platform Logos - All in ONE Line */}
          <div className="mb-12">
            <p className="text-sm text-gray-600 mb-8 font-medium uppercase tracking-wider">Works seamlessly with all major platforms</p>
            
            {/* All 7 Logos in One Row */}
            <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
              
              {/* Magento - Small (Left End) */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/MagentoCommerce.png" 
                  alt="Magento"
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </div>
              
              {/* WooCommerce - Medium */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/wooCommerce.png" 
                  alt="WooCommerce"
                  className="h-14 md:h-16 w-auto object-contain"
                />
              </div>
              
              {/* Wix - Larger */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/Wix.png" 
                  alt="Wix"
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
              
              {/* SHOPIFY - BIGGEST (Center) */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/Shopify.png" 
                  alt="Shopify"
                  className="h-24 md:h-32 w-auto object-contain"
                />
              </div>
              
              {/* SquareSpace - Larger */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/squarespace.png" 
                  alt="SquareSpace"
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
              
              {/* BigCommerce - Medium */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/BigCommerce.png" 
                  alt="BigCommerce"
                  className="h-14 md:h-16 w-auto object-contain"
                />
              </div>
              
              {/* OpenCart - Small (Right End) */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/opencart.png" 
                  alt="OpenCart"
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </div>
              
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/20 text-gold-dark rounded-full mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold">Trusted by 1000+ stores</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            E-commerce Apps for
            <span className="block bg-gradient-to-r from-turquoise-dark to-peach bg-clip-text text-transparent">Every Platform</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Powerful tools to manage inventory, boost loyalty, collect reviews, and grow your online store—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 bg-turquoise text-dark rounded-lg font-medium hover:bg-turquoise-dark transition-all duration-200 shadow-lg text-lg w-full sm:w-auto text-center">
              Start Free Trial
            </Link>
            <Link href="#pricing" className="px-8 py-4 border-2 border-turquoise text-turquoise-dark rounded-lg font-medium hover:bg-turquoise-light/30 transition-all duration-200 text-lg w-full sm:w-auto text-center">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
