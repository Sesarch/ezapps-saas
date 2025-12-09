'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-cyan-50/30 via-white to-orange-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Platform Logos - ALWAYS ONE LINE */}
          <div className="mb-12">
            <p className="text-sm text-gray-600 mb-8 font-medium uppercase tracking-wider">Works seamlessly with all major platforms</p>
            
            {/* All 9 logos in ONE row - NEVER wraps */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
              
              {/* Left 4 logos */}
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300">
                <img src="/Wix.png" alt="Wix" className="h-5 sm:h-7 md:h-10 w-auto object-contain" />
              </div>
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300">
                <img src="/squarespace.png" alt="Squarespace" className="h-5 sm:h-7 md:h-10 w-auto object-contain" />
              </div>
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300">
                <img src="/wooCommerce.png" alt="WooCommerce" className="h-5 sm:h-7 md:h-10 w-auto object-contain" />
              </div>
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300">
                <img src="/BigCommerce.png" alt="BigCommerce" className="h-5 sm:h-7 md:h-10 w-auto object-contain" />
              </div>

              {/* Center: Shopify (Biggest) */}
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300 mx-1 sm:mx-2 md:mx-4">
                <img src="/Shopify.png" alt="Shopify" className="h-12 sm:h-16 md:h-20 w-auto object-contain" />
              </div>

              {/* Right 4 logos */}
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300">
                <img src="/opencart.png" alt="OpenCart" className="h-5 sm:h-7 md:h-10 w-auto object-contain" />
              </div>
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300">
                <img src="/Etsy.png" alt="Etsy" className="h-5 sm:h-7 md:h-10 w-auto object-contain" />
              </div>
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300">
                <img src="/Amazon.png" alt="Amazon" className="h-5 sm:h-7 md:h-10 w-auto object-contain" />
              </div>
              <div className="flex-shrink-0 hover:scale-110 transition-all duration-300">
                <img src="/MagentoCommerce.png" alt="Magento" className="h-5 sm:h-7 md:h-10 w-auto object-contain" />
              </div>
              
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold">Trusted by 1000+ stores</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            E-commerce Apps for
            <span className="block bg-gradient-to-r from-[#97999B] to-[#F5DF4D] bg-clip-text text-transparent">Every Platform</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Powerful tools to manage inventory, boost loyalty, collect reviews, and grow your online store—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 bg-[#F5DF4D] text-gray-900 rounded-xl font-semibold hover:bg-[#e5cf3d] transition-all duration-200 shadow-lg text-lg w-full sm:w-auto text-center">
              Start Free Trial
            </Link>
            <Link href="#pricing" className="px-8 py-4 border-2 border-[#97999B] text-[#97999B] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 text-lg w-full sm:w-auto text-center">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
