'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function StoresPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [stores, setStores] = useState<any[]>([])
  const [shopDomain, setShopDomain] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  // Check for success/error from OAuth callback
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const shop = searchParams.get('shop')

    if (success === 'true' && shop) {
      setMessage({ type: 'success', text: `Successfully connected ${shop}!` })
    } else if (error) {
      setMessage({ type: 'error', text: 'Failed to connect store. Please try again.' })
    }
  }, [searchParams])

  // Fetch user's stores
  useEffect(() => {
    if (user) {
      supabase
        .from('stores')
        .select('*, platforms(*)')
        .eq('user_id', user.id)
        .then(({ data }) => setStores(data || []))
    }
  }, [user])

  const connectShopify = () => {
    if (!shopDomain) {
      setMessage({ type: 'error', text: 'Please enter your store domain' })
      return
    }

    setConnecting(true)
    setMessage(null)

    // Format the shop domain
    let shop = shopDomain.trim().toLowerCase()
    
    // Add .myshopify.com if not present
    if (!shop.includes('.myshopify.com')) {
      shop = shop.replace('.myshopify.com', '') + '.myshopify.com'
    }

    // Redirect to Shopify OAuth
    window.location.href = `/api/auth/shopify?shop=${shop}`
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Connected Stores</h1>
        <p className="text-gray-600 mt-1">Manage your e-commerce store connections</p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Connected Stores */}
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{store.store_name}</h3>
                  <p className="text-sm text-gray-500">{store.store_url}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="flex items-center text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Connected
                </span>
                <button className="text-sm text-gray-500 hover:text-red-600">
                  Disconnect
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-8">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores connected yet</h3>
          <p className="text-gray-600 mb-6">Connect your first store to start using EZ Apps</p>
        </div>
      )}

      {/* Connect Shopify Store */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Connect a Shopify Store</h2>
          <p className="text-sm text-gray-500">Enter your Shopify store domain to get started</p>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex">
                <input
                  type="text"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  placeholder="your-store-name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
                <span className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl text-gray-500">
                  .myshopify.com
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Example: if your store is "my-store.myshopify.com", enter "my-store"
              </p>
            </div>
            <button
              onClick={connectShopify}
              disabled={connecting}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 h-fit"
            >
              {connecting ? 'Connecting...' : 'Connect Store'}
            </button>
          </div>
        </div>
      </div>

      {/* Other Platforms Coming Soon */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">More Platforms Coming Soon</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {['WooCommerce', 'Wix', 'BigCommerce', 'Squarespace', 'Magento', 'OpenCart'].map((platform) => (
            <div key={platform} className="bg-gray-100 rounded-xl p-4 text-center opacity-60">
              <div className="text-2xl mb-2">🔜</div>
              <p className="text-sm text-gray-600">{platform}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
            <p className="text-gray-600 text-sm">
              To find your store domain, go to your Shopify admin. Your domain is shown in the URL: 
              <strong> https://your-store-name.myshopify.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
