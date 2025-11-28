'use client'

import Link from 'next/link'

export default function Pricing() {
  const platforms = [
    { name: 'Shopify', logo: '/Shopify.png' },
    { name: 'WooCommerce', logo: '/wooCommerce.png' },
    { name: 'Wix', logo: '/Wix.png' },
    { name: 'BigCommerce', logo: '/BigCommerce.png' },
    { name: 'SquareSpace', logo: '/squarespace.png' },
    { name: 'Magento', logo: '/MagentoCommerce.png' },
    { name: 'OpenCart', logo: '/opencart.png' },
  ]

  const apps = [
    'Inventory Management',
    'Loyalty Program',
    'Review Manager',
    'Upsell Engine',
    '3D Model Viewer',
    'Form Builder',
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-gray-600">
            Start with one app or get everything. All plans include 14-day free trial.
          </p>
        </div>

        {/* Per Platform Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Starter</h3>
              <p className="text-gray-500 text-sm">Perfect to get started</p>
            </div>
            
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-gray-900">$15</span>
              <span className="text-gray-500">/month</span>
            </div>

            {/* Platform Icons */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 text-center mb-3">Works with any platform:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {platforms.map((platform) => (
                  <div key={platform.name} className="w-8 h-8 bg-gray-50 rounded-lg p-1 hover:bg-gray-100 transition-colors" title={platform.name}>
                    <img src={platform.logo} alt={platform.name} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>1 App</strong> of your choice</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>1 Platform</strong> of your choice</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Email Support</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Basic Analytics</span>
              </li>
            </ul>

            <Link href="/signup" className="block w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-semibold text-center hover:bg-gray-200 transition-all duration-200">
              Start Free Trial
            </Link>
          </div>

          {/* Growth Plan - Popular */}
          <div className="relative bg-white rounded-2xl border-2 border-teal-400 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 scale-105">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Growth</h3>
              <p className="text-gray-500 text-sm">Best for growing stores</p>
            </div>
            
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-gray-900">$39</span>
              <span className="text-gray-500">/month</span>
              <p className="text-teal-600 text-sm font-medium mt-1">Save $6/month</p>
            </div>

            {/* Platform Icons */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 text-center mb-3">Works with any platform:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {platforms.map((platform) => (
                  <div key={platform.name} className="w-8 h-8 bg-teal-50 rounded-lg p-1 hover:bg-teal-100 transition-colors" title={platform.name}>
                    <img src={platform.logo} alt={platform.name} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>3 Apps</strong> of your choice</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>1 Platform</strong> of your choice</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Priority Support</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Advanced Analytics</span>
              </li>
            </ul>

            <Link href="/signup" className="block w-full py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-xl font-semibold text-center hover:from-teal-500 hover:to-cyan-500 transition-all duration-200 shadow-lg">
              Start Free Trial
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-8">
            <div className="absolute -top-3 right-4 bg-amber-400 text-amber-900 px-3 py-0.5 rounded-full text-xs font-semibold">
              Best Value
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Pro</h3>
              <p className="text-gray-500 text-sm">All apps, one platform</p>
            </div>
            
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-gray-900">$75</span>
              <span className="text-gray-500">/month</span>
              <p className="text-amber-600 text-sm font-medium mt-1">Save $15/month</p>
            </div>

            {/* Platform Icons */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 text-center mb-3">Works with any platform:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {platforms.map((platform) => (
                  <div key={platform.name} className="w-8 h-8 bg-gray-50 rounded-lg p-1 hover:bg-gray-100 transition-colors" title={platform.name}>
                    <img src={platform.logo} alt={platform.name} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>All 6 Apps</strong> included</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>1 Platform</strong> of your choice</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>24/7 Support</span>
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>API Access</span>
              </li>
            </ul>

            <Link href="/signup" className="block w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-semibold text-center hover:bg-gray-200 transition-all duration-200">
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Enterprise Plan - Full Width */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <span className="inline-block px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-sm font-semibold mb-3">
                    Enterprise
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">All Platforms. All Apps.</h3>
                  <p className="text-gray-300">The complete solution for serious e-commerce businesses</p>
                </div>
                <div className="mt-6 md:mt-0 text-center md:text-right">
                  <div className="text-5xl md:text-6xl font-bold">$299</div>
                  <div className="text-gray-400">/month</div>
                  <p className="text-teal-400 text-sm font-medium mt-1">Save $226/month vs separate plans</p>
                </div>
              </div>

              {/* All Platforms */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-4">All 7 platforms included:</p>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <div key={platform.name} className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <img src={platform.logo} alt={platform.name} className="w-6 h-6 object-contain mr-2" />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Apps */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-4">All 6 apps included:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {apps.map((app) => (
                    <div key={app} className="flex items-center">
                      <svg className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">24/7 Priority Support</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Dedicated Manager</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">API Access</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">White-label Options</span>
                </div>
              </div>

              <Link href="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 rounded-xl font-semibold hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-lg">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>

        {/* Simplified Comparison Table */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Compare All Plans</h3>
            <p className="text-gray-600">See what's included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    <div>Starter</div>
                    <div className="text-teal-500 font-bold">$15/mo</div>
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-teal-50 rounded-t-xl">
                    <div>Growth</div>
                    <div className="text-teal-500 font-bold">$39/mo</div>
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    <div>Pro</div>
                    <div className="text-teal-500 font-bold">$75/mo</div>
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    <div>Enterprise</div>
                    <div className="text-amber-500 font-bold">$299/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Apps & Platforms Section */}
                <tr className="bg-gray-50">
                  <td colSpan={5} className="py-3 px-4 font-semibold text-gray-700">Apps & Platforms</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Number of Apps</td>
                  <td className="py-4 px-4 text-center font-medium">1 app</td>
                  <td className="py-4 px-4 text-center bg-teal-50 font-medium">3 apps</td>
                  <td className="py-4 px-4 text-center font-medium text-teal-600">All 6 apps</td>
                  <td className="py-4 px-4 text-center font-medium text-teal-600">All 6 apps</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Number of Platforms</td>
                  <td className="py-4 px-4 text-center font-medium">1 platform</td>
                  <td className="py-4 px-4 text-center bg-teal-50 font-medium">1 platform</td>
                  <td className="py-4 px-4 text-center font-medium">1 platform</td>
                  <td className="py-4 px-4 text-center font-medium text-amber-600">All 7 platforms</td>
                </tr>

                {/* Support Section */}
                <tr className="bg-gray-50">
                  <td colSpan={5} className="py-3 px-4 font-semibold text-gray-700">Support</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Email Support</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                  <td className="py-4 px-4 text-center bg-teal-50 text-teal-500">✓</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Priority Support</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                  <td className="py-4 px-4 text-center bg-teal-50 text-teal-500">✓</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">24/7 Support</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                  <td className="py-4 px-4 text-center bg-teal-50 text-gray-300">—</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Dedicated Manager</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                  <td className="py-4 px-4 text-center bg-teal-50 text-gray-300">—</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                </tr>

                {/* Features Section */}
                <tr className="bg-gray-50">
                  <td colSpan={5} className="py-3 px-4 font-semibold text-gray-700">Features</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Analytics</td>
                  <td className="py-4 px-4 text-center text-gray-600">Basic</td>
                  <td className="py-4 px-4 text-center bg-teal-50 text-gray-600">Advanced</td>
                  <td className="py-4 px-4 text-center text-gray-600">Advanced</td>
                  <td className="py-4 px-4 text-center text-amber-600">Enterprise</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">API Access</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                  <td className="py-4 px-4 text-center bg-teal-50 text-gray-300">—</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">White-label Options</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                  <td className="py-4 px-4 text-center bg-teal-50 text-gray-300">—</td>
                  <td className="py-4 px-4 text-center text-gray-300">—</td>
                  <td className="py-4 px-4 text-center text-teal-500">✓</td>
                </tr>

                {/* CTA Row */}
                <tr>
                  <td className="py-6 px-4"></td>
                  <td className="py-6 px-4 text-center">
                    <Link href="/signup" className="inline-block px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Start Free
                    </Link>
                  </td>
                  <td className="py-6 px-4 text-center bg-teal-50 rounded-b-xl">
                    <Link href="/signup" className="inline-block px-6 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors">
                      Start Free
                    </Link>
                  </td>
                  <td className="py-6 px-4 text-center">
                    <Link href="/signup" className="inline-block px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Start Free
                    </Link>
                  </td>
                  <td className="py-6 px-4 text-center">
                    <Link href="/signup" className="inline-block px-6 py-2 bg-amber-400 text-gray-900 rounded-lg font-medium hover:bg-amber-500 transition-colors">
                      Start Free
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-teal-50 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-2">14-Day Money-Back Guarantee</h4>
            <p className="text-gray-600">Try any plan risk-free. If you're not satisfied, get a full refund within 14 days. No questions asked.</p>
          </div>
        </div>

      </div>
    </section>
  )
}
