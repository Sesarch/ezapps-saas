'use client'

import Image from 'next/image'

export default function Platforms() {
  const platforms = [
    { id: 'shopify', name: 'Shopify', logo: '/Shopify.png', color: 'from-green-600 to-green-700', users: '2M+' },
    { id: 'woocommerce', name: 'WooCommerce', logo: '/wooCommerce.png', color: 'from-purple-600 to-purple-700', users: '4M+' },
    { id: 'wix', name: 'Wix', logo: '/Wix.png', color: 'from-blue-600 to-blue-700', users: '200K+' },
    { id: 'bigcommerce', name: 'BigCommerce', logo: '/BigCommerce.png', color: 'from-gray-700 to-gray-900', users: '60K+' },
    { id: 'squarespace', name: 'SquareSpace', logo: '/squarespace.png', color: 'from-black to-gray-800', users: '800K+' },
    { id: 'magento', name: 'Magento', logo: '/MagentoCommerce.png', color: 'from-orange-600 to-red-600', users: '250K+' },
    { id: 'opencart', name: 'OpenCart', logo: '/opencart.png', color: 'from-cyan-600 to-blue-600', users: '350K+' },
  ]

  return (
    <section id="platforms" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            One Solution for All Platforms
          </h2>
          <p className="text-xl text-gray-600">
            Seamlessly integrate with the world's most popular e-commerce platforms. Same powerful features, optimized for each platform.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform, index) => (
            <div
              key={platform.name}
              className="group card p-6 hover:scale-105 transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Platform Badge */}
              <div className={`w-full h-32 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center mb-4 p-4 group-hover:shadow-xl transition-shadow duration-300`}>
                <img 
                  src={platform.logo} 
                  alt={platform.name}
                  className="max-h-20 w-auto object-contain"
                />
              </div>

              {/* Platform Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                {platform.name}
              </h3>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{platform.users} stores</span>
                <span className="text-primary-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                  Connect →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Don't see your platform? <a href="/contact" className="text-primary-600 font-semibold hover:underline">Contact us</a> and we'll add it.
          </p>
        </div>
      </div>
    </section>
  )
}
