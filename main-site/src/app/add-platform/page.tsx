'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { platforms, pricing, getAllPlatforms } from '@/config/platforms'

export default function AddPlatformPage() {
  const searchParams = useSearchParams()
  const platformId = searchParams.get('platform') || 'woocommerce'
  const platform = platforms[platformId]
  const allPlatforms = getAllPlatforms()

  if (!platform) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Platform not found</h1>
          <Link href="/dashboard" className="text-teal-600 hover:underline mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isComingSoon = platform.status === 'coming_soon'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg"
            style={{ backgroundColor: platform.colors.primary }}
          >
            {platform.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add {platform.displayName} to Your Account
          </h1>
          <p className="text-gray-600">
            {isComingSoon 
              ? `${platform.displayName} integration is coming soon!`
              : `Get access to all 6 apps for your ${platform.displayName} store`
            }
          </p>
        </div>

        {isComingSoon ? (
          /* Coming Soon UI */
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg mx-auto">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h2>
            <p className="text-gray-600 mb-6">
              We're working hard to bring {platform.displayName} integration to EZ Apps. 
              Join the waitlist to be notified when it's ready.
            </p>
            
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white transition-all"
                style={{ backgroundColor: platform.colors.primary }}
              >
                Notify Me When Available
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-500">
              In the meantime, you can use EZ Apps with{' '}
              <Link href="/dashboard?platform=shopify" className="text-teal-600 hover:underline">
                Shopify
              </Link>
            </p>
          </div>
        ) : (
          /* Pricing Options */
          <div className="grid md:grid-cols-2 gap-6">
            {/* Single Platform Option */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: platform.colors.primary }}
                >
                  {platform.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Add {platform.displayName}</h3>
                  <p className="text-sm text-gray-500">Single platform add-on</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">${pricing.additionalPlatform.monthly}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  or ${pricing.additionalPlatform.yearly}/year (save 2 months)
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  All 6 Apps included
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  Unlimited products
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  10,000 orders/month
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  Email support
                </li>
              </ul>

              <button
                className="w-full py-3 rounded-xl font-semibold text-white transition-all"
                style={{ backgroundColor: platform.colors.primary }}
              >
                Add {platform.displayName}
              </button>
            </div>

            {/* Bundle Option */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl">
                  ✨
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">All Platforms Bundle</h3>
                  <p className="text-sm text-gray-500">Access all 9 platforms</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">${pricing.allPlatformsBundle.monthly}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-green-600 font-medium mt-1">
                  Save ${pricing.allPlatformsBundle.savings}/month vs buying separately!
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <strong>All 9 platforms</strong>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  All 6 Apps included
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  Unlimited products
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <strong>Unlimited orders</strong>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <strong>Priority support</strong>
                </li>
              </ul>

              <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all">
                Get All Platforms
              </button>
            </div>
          </div>
        )}

        {/* All Platforms Preview */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">All Available Platforms</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4">
            {allPlatforms.map((p) => (
              <div 
                key={p.id} 
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  p.status === 'active' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                } ${p.id === platformId ? 'ring-2 ring-offset-2' : ''}`}
                style={{ 
                  ringColor: p.id === platformId ? p.colors.primary : undefined 
                }}
              >
                <div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg mb-2 ${
                    p.status === 'coming_soon' ? 'grayscale' : ''
                  }`}
                  style={{ backgroundColor: p.colors.primary }}
                >
                  {p.icon}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{p.name}</span>
                {p.status === 'coming_soon' && (
                  <span className="text-[10px] text-gray-400">Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
