'use client'

import Link from 'next/link'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            Shopify Apps
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start with Inventory Management. More apps launching soon. All plans include 7-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-500 text-sm">Perfect for small stores</p>
            </div>
            
            <div className="text-center mb-8">
              <span className="text-5xl font-bold text-gray-900">$29</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-4 mb-8 text-sm">
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>Inventory Management</strong> app</span>
              </li>
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Up to 1,000 products</span>
              </li>
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Email support</span>
              </li>
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>7-day free trial</span>
              </li>
            </ul>

            <Link 
              href="/signup?plan=starter" 
              className="block w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-50 transition-all duration-200"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Growth Plan - Popular */}
          <div className="relative bg-gradient-to-b from-[#96BF48] to-[#5E8E3E] rounded-2xl p-8 shadow-2xl scale-105 transform">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F5DF4D] text-gray-900 px-6 py-2 rounded-full text-xs font-bold shadow-lg">
              MOST POPULAR
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
              <p className="text-green-100 text-sm">Best for growing stores</p>
            </div>
            
            <div className="text-center mb-8">
              <span className="text-5xl font-bold text-white">$69</span>
              <span className="text-green-100">/month</span>
            </div>

            <ul className="space-y-4 mb-8 text-sm">
              <li className="flex items-start text-white">
                <svg className="w-5 h-5 text-[#F5DF4D] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>All 6 apps</strong> (as they launch)</span>
              </li>
              <li className="flex items-start text-white">
                <svg className="w-5 h-5 text-[#F5DF4D] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Unlimited products</span>
              </li>
              <li className="flex items-start text-white">
                <svg className="w-5 h-5 text-[#F5DF4D] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Priority support</span>
              </li>
              <li className="flex items-start text-white">
                <svg className="w-5 h-5 text-[#F5DF4D] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start text-white">
                <svg className="w-5 h-5 text-[#F5DF4D] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>7-day free trial</span>
              </li>
            </ul>

            <Link 
              href="/signup?plan=growth" 
              className="block w-full py-3 bg-[#F5DF4D] text-gray-900 rounded-xl font-bold text-center hover:bg-[#e5cf3d] transition-all duration-200 shadow-lg"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-500 text-sm">For high-volume stores</p>
            </div>
            
            <div className="text-center mb-8">
              <span className="text-5xl font-bold text-gray-900">$149</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-4 mb-8 text-sm">
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span><strong>All 6 apps</strong> (as they launch)</span>
              </li>
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Unlimited everything</span>
              </li>
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>24/7 dedicated support</span>
              </li>
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>API access & webhooks</span>
              </li>
              <li className="flex items-start text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Account manager</span>
              </li>
            </ul>

            <Link 
              href="/contact?plan=enterprise" 
              className="block w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-50 transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h4 className="text-lg font-bold text-gray-900">7-Day Money-Back Guarantee</h4>
            </div>
            <p className="text-gray-600 text-sm">Try any plan risk-free. Not satisfied? Get a full refund, no questions asked.</p>
          </div>
        </div>

      </div>
    </section>
  )
}
