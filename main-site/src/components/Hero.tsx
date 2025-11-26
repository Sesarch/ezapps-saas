'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 section-padding bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Platform Logos - All in ONE Line */}
          <div className="mb-12 animate-fade-in">
            <p className="text-sm text-gray-500 mb-8 font-medium uppercase tracking-wider">Works seamlessly with all major platforms</p>
            
            {/* All 7 Logos in One Row */}
            <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
              
              {/* Magento - Small (Left End) */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/MagentoCommerce.png" 
                  alt="Magento"
                  className="h-12 md:h-14 w-auto object-contain drop-shadow-md"
                />
              </div>
              
              {/* WooCommerce - Medium */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/wooCommerce.png" 
                  alt="WooCommerce"
                  className="h-14 md:h-17 w-auto object-contain drop-shadow-md"
                />
              </div>
              
              {/* Wix - Larger */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/Wix.png" 
                  alt="Wix"
                  className="h-16 md:h-20 w-auto object-contain drop-shadow-lg"
                />
              </div>
              
              {/* SHOPIFY - BIGGEST (Center) */}
              <div className="hover:scale-115 transition-all duration-300 relative">
                <img 
                  src="/Shopify.png" 
                  alt="Shopify"
                  className="h-24 md:h-32 w-auto object-contain drop-shadow-xl"
                />
              </div>
              
              {/* SquareSpace - Larger */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/squarespace.png" 
                  alt="SquareSpace"
                  className="h-16 md:h-20 w-auto object-contain drop-shadow-lg"
                />
              </div>
              
              {/* BigCommerce - Medium */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/BigCommerce.png" 
                  alt="BigCommerce"
                  className="h-14 md:h-17 w-auto object-contain drop-shadow-md"
                />
              </div>
              
              {/* OpenCart - Small (Right End) */}
              <div className="hover:scale-110 transition-all duration-300">
                <img 
                  src="/opencart.png" 
                  alt="OpenCart"
                  className="h-12 md:h-14 w-auto object-contain drop-shadow-md"
                />
              </div>
              
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8 animate-fade-in">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold">Trusted by 1000+ stores</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
            E-commerce Apps for
            <span className="block text-gradient">Every Platform</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Powerful tools to manage inventory, boost loyalty, collect reviews, and grow your online store—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Start Free Trial
            </Link>
            <Link href="#pricing" className="btn-outline text-lg px-8 py-4 w-full sm:w-auto">
              View Pricing
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  )
}
```

---

## ✅ Correct Order Now:
```
[Magento] [WooCommerce] [Wix] [SHOPIFY] [SquareSpace] [BigCommerce] [OpenCart]
   ←                          CENTER                                    →
