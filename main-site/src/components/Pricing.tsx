'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Pricing() {
  const [selectedPlatform, setSelectedPlatform] = useState('shopify')

  const platforms = [
    { id: 'shopify', name: 'Shopify', logo: '/Shopify.png' },
    { id: 'woocommerce', name: 'WooCommerce', logo: '/wooCommerce.png' },
    { id: 'wix', name: 'Wix', logo: '/Wix.png' },
    { id: 'bigcommerce', name: 'BigCommerce', logo: '/BigCommerce.png' },
    { id: 'squarespace', name: 'SquareSpace', logo: '/squarespace.png' },
    { id: 'magento', name: 'Magento', logo: '/MagentoCommerce.png' },
    { id: 'opencart', name: 'OpenCart', logo: '/opencart.png' },
  ]

  const apps = [
    'Inventory Management',
    'Loyalty Program',
    'Review Manager',
    'Upsell Engine',
    '3D Model Viewer',
    'Form Builder',
  ]

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform)

  return (
    <section id="pricing" className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
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

        {/* MAIN PRICING PANEL */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-16">
          
          {/* Platform Selector - Inside Panel */}
          <div className="mb-10">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Select Your Platform</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`flex items-center px-3 md:px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    selectedPlatform === platform.id
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={platform.logo} 
                    alt={platform.name} 
                    className="w-6 h-6 object-contain mr-2"
                  />
                  <span className={`text-sm font-medium ${
                    selectedPlatform === platform.id ? 'text-teal-700' : 'text-gray-600'
                  }`}>
                    {platform.name}
                  </span>
                  {selectedPlatform === platform.id && (
                    <svg className="w-4 h-4 text-teal-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-10"></div>

          {/* Pricing Cards - Inside Same Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Starter Plan */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Starter</h3>
                <p className="text-gray-500 text-sm">Perfect to get started</p>
              </div>
              
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gray-900">$15</span>
                <span className="text-gray-500">/month</span>
              </div>

              {/* Selected Platform Badge */}
              <div className="flex items-center justify-center mb-4 p-2 bg-white rounded-lg border border-gray-200">
                <img 
                  src={selectedPlatformData?.logo} 
                  alt={selectedPlatformData?.name} 
                  className="w-6 h-6 object-contain mr-2"
                />
                <span className="text-sm font-medium text-gray-700">{selectedPlatformData?.name}</span>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span><strong>1 App</strong> of your choice</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Email Support</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Basic Analytics</span>
                </li>
              </ul>

              <Link 
                href={`/signup?platform=${selectedPlatform}&plan=starter`} 
                className="block w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-100 transition-all duration-200"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Growth Plan - Popular */}
            <div className="relative bg-gradient-to-b from-teal-500 to-teal-600 rounded-2xl p-6 shadow-xl scale-105">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>

              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white">Growth</h3>
                <p className="text-teal-100 text-sm">Best for growing stores</p>
              </div>
              
              <div className="text-center mb-1">
                <span className="text-4xl font-bold text-white">$39</span>
                <span className="text-teal-100">/month</span>
              </div>
              <p className="text-center text-amber-300 text-sm font-medium mb-4">Save $6/month</p>

              {/* Selected Platform Badge */}
              <div className="flex items-center justify-center mb-4 p-2 bg-white/20 rounded-lg">
                <img 
                  src={selectedPlatformData?.logo} 
                  alt={selectedPlatformData?.name} 
                  className="w-6 h-6 object-contain mr-2"
                />
                <span className="text-sm font-medium text-white">{selectedPlatformData?.name}</span>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center text-white">
                  <svg className="w-4 h-4 text-amber-300 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span><strong>3 Apps</strong> of your choice</span>
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-4 h-4 text-amber-300 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-4 h-4 text-amber-300 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Advanced Analytics</span>
                </li>
              </ul>

              <Link 
                href={`/signup?platform=${selectedPlatform}&plan=growth`} 
                className="block w-full py-3 bg-white text-teal-600 rounded-xl font-bold text-center hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-3 right-4 bg-amber-400 text-amber-900 px-3 py-0.5 rounded-full text-xs font-bold">
                BEST VALUE
              </div>

              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                <p className="text-gray-500 text-sm">All apps included</p>
              </div>
              
              <div className="text-center mb-1">
                <span className="text-4xl font-bold text-gray-900">$75</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-center text-amber-600 text-sm font-medium mb-4">Save $15/month</p>

              {/* Selected Platform Badge */}
              <div className="flex items-center justify-center mb-4 p-2 bg-white rounded-lg border border-gray-200">
                <img 
                  src={selectedPlatformData?.logo} 
                  alt={selectedPlatformData?.name} 
                  className="w-6 h-6 object-contain mr-2"
                />
                <span className="text-sm font-medium text-gray-700">{selectedPlatformData?.name}</span>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span><strong>All 6 Apps</strong> included</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>24/7 Support</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>API Access</span>
                </li>
              </ul>

              <Link 
                href={`/signup?platform=${selectedPlatform}&plan=pro`} 
                className="block w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-100 transition-all duration-200"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>

        {/* Enterprise Plan - Separate Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                
                {/* Left Side - Info */}
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-bold mb-4">
                    ENTERPRISE
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Need All Platforms?</h3>
                  <p className="text-gray-400 mb-6">Get everything - all 6 apps on all 7 platforms</p>
                  
                  {/* Platforms Row */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="flex items-center bg-white/10 rounded-lg px-2 py-1">
                        <img src={platform.logo} alt={platform.name} className="w-5 h-5 object-contain" />
                      </div>
                    ))}
                  </div>

                  {/* Features Row */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-teal-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      All 6 Apps
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-teal-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      All 7 Platforms
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-teal-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Dedicated Manager
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-teal-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      API Access
                    </span>
                  </div>
                </div>

                {/* Right Side - Price & CTA */}
                <div className="text-center lg:text-right">
                  <div className="text-4xl md:text-5xl font-bold mb-1">$299</div>
                  <div className="text-gray-400 mb-2">/month</div>
                  <p className="text-teal-400 text-sm font-medium mb-4">Save $226/month</p>
                  <Link href="/signup?plan=enterprise" className="inline-block px-8 py-3 bg-amber-400 text-gray-900 rounded-xl font-bold hover:bg-amber-500 transition-all duration-200">
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Compare All Plans</h3>
            <p className="text-gray-600">See what is included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-900">
                    <div>Starter</div>
                    <div className="text-teal-500">$15/mo</div>
                  </th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-900 bg-teal-50">
                    <div>Growth</div>
                    <div className="text-teal-500">$39/mo</div>
                  </th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-900">
                    <div>Pro</div>
                    <div className="text-teal-500">$75/mo</div>
                  </th>
                  <th className="text-center py-3 px-3 font-semibold text-gray-900">
                    <div>Enterprise</div>
                    <div className="text-amber-500">$299/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-600">Number of Apps</td>
                  <td className="py-3 px-3 text-center">1</td>
                  <td className="py-3 px-3 text-center bg-teal-50">3</td>
                  <td className="py-3 px-3 text-center text-teal-600 font-medium">All 6</td>
                  <td className="py-3 px-3 text-center text-teal-600 font-medium">All 6</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-600">Platforms</td>
                  <td className="py-3 px-3 text-center">1</td>
                  <td className="py-3 px-3 text-center bg-teal-50">1</td>
                  <td className="py-3 px-3 text-center">1</td>
                  <td className="py-3 px-3 text-center text-amber-600 font-medium">All 7</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-600">Priority Support</td>
                  <td className="py-3 px-3 text-center text-gray-300">—</td>
                  <td className="py-3 px-3 text-center bg-teal-50 text-teal-500">✓</td>
                  <td className="py-3 px-3 text-center text-teal-500">✓</td>
                  <td className="py-3 px-3 text-center text-teal-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-600">24/7 Support</td>
                  <td className="py-3 px-3 text-center text-gray-300">—</td>
                  <td className="py-3 px-3 text-center bg-teal-50 text-gray-300">—</td>
                  <td className="py-3 px-3 text-center text-teal-500">✓</td>
                  <td className="py-3 px-3 text-center text-teal-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-600">API Access</td>
                  <td className="py-3 px-3 text-center text-gray-300">—</td>
                  <td className="py-3 px-3 text-center bg-teal-50 text-gray-300">—</td>
                  <td className="py-3 px-3 text-center text-teal-500">✓</td>
                  <td className="py-3 px-3 text-center text-teal-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-600">Dedicated Manager</td>
                  <td className="py-3 px-3 text-center text-gray-300">—</td>
                  <td className="py-3 px-3 text-center bg-teal-50 text-gray-300">—</td>
                  <td className="py-3 px-3 text-center text-gray-300">—</td>
                  <td className="py-3 px-3 text-center text-teal-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-teal-50 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-1">14-Day Money-Back Guarantee</h4>
            <p className="text-gray-600 text-sm">Try any plan risk-free. Not satisfied? Get a full refund.</p>
          </div>
        </div>

      </div>
    </section>
  )
}
