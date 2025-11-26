'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 section-padding bg-gradient-to-br from-gray-50 via-white to-primary-50/30 overflow-hidden">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-8 animate-fade-in">
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Start Free Trial
            </Link>
            <Link href="#pricing" className="btn-outline text-lg px-8 py-4 w-full sm:w-auto">
              View Pricing
            </Link>
          </div>

          {/* Platform Badges */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-gray-500 mb-6 font-medium">Works seamlessly with:</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                { name: 'Shopify', logo: '/Shopify.png' },
                { name: 'WooCommerce', logo: '/wooCommerce.png' },
                { name: 'Wix', logo: '/Wix.png' },
                { name: 'BigCommerce', logo: '/BigCommerce.png' },
                { name: 'SquareSpace', logo: '/squarespace.png' },
                { name: 'Magento', logo: '/MagentoCommerce.png' },
                { name: 'OpenCart', logo: '/opencart.png' },
              ].map((platform, index) => (
                <div 
                  key={platform.name} 
                  className="px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105"
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                >
                  <img 
                    src={platform.logo} 
                    alt={platform.name}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  )
}
