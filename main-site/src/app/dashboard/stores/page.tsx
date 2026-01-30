'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const FETCH_COOLDOWN = 5000 // 5 seconds
const LAST_FETCH_KEY = 'stores_last_fetch'

export default function StoresPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stores, setStores] = useState<any[]>([])
  const [shopDomain, setShopDomain] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Check for success/error from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const error = params.get('error')
    const shop = params.get('shop')

    if (success === 'true' && shop) {
      setMessage({ type: 'success', text: `Successfully connected ${shop}!` })
      router.replace('/dashboard/stores')
    } else if (error) {
      setMessage({ type: 'error', text: 'Failed to connect store. Please try again.' })
      router.replace('/dashboard/stores')
    }
  }, [router])

  // Fetch stores with persistent cooldown using sessionStorage
  const fetchStores = useCallback(async (forceFetch = false) => {
    if (!user) {
      setLoading(false)
      return
    }

    // Check cooldown from sessionStorage (persists across component remounts)
    const lastFetch = sessionStorage.getItem(LAST_FETCH_KEY)
    const now = Date.now()
    
    if (!forceFetch && lastFetch) {
      const timeSinceLastFetch = now - parseInt(lastFetch)
      if (timeSinceLastFetch < FETCH_COOLDOWN) {
        console.log('Skipping fetch - cooldown active:', (FETCH_COOLDOWN - timeSinceLastFetch) / 1000, 'seconds remaining')
        setLoading(false)
        return
      }
    }

    // Don't fetch if tab is not visible (unless forced)
    if (!forceFetch && document.hidden) {
      console.log('Skipping fetch - tab not visible')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      sessionStorage.setItem(LAST_FETCH_KEY, now.toString())
      
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('stores')
        .select('*, platforms(*)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fetch stores error:', error)
        setMessage({ type: 'error', text: 'Failed to load stores' })
      } else {
        console.log('Fetched stores:', data?.length || 0, 'stores')
        setStores(data || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Initial fetch
  useEffect(() => {
    fetchStores(true)
  }, [fetchStores])

  const connectShopify = () => {
    if (!shopDomain) {
      setMessage({ type: 'error', text: 'Please enter your store domain' })
      return
    }

    setConnecting(true)
    setMessage(null)

    let shop = shopDomain.trim().toLowerCase()
    shop = shop.replace(/\.myshopify\.com$/i, '')

    window.location.href = `/api/auth/shopify?shop=${shop}`
  }

  const disconnectStore = async (storeId: string, storeName: string) => {
    if (!confirm(`Are you sure you want to disconnect "${storeName}"?`)) {
      return
    }

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('stores')
        .update({ is_active: false })
        .eq('id', storeId)
        .eq('user_id', user?.id)

      if (error) {
        console.error('Disconnect store error:', error)
        setMessage({ type: 'error', text: `Failed to disconnect store: ${error.message}` })
      } else {
        setMessage({ type: 'success', text: `${storeName} has been disconnected successfully.` })
        sessionStorage.removeItem(LAST_FETCH_KEY) // Clear cooldown
        fetchStores(true)
      }
    } catch (err: any) {
      console.error('Disconnect error:', err)
      setMessage({ type: 'error', text: `Failed to disconnect: ${err.message || 'Unknown error'}` })
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Connected Stores</h1>
        <p className="text-gray-600 mt-1">Manage your e-commerce store connections</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
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
                <button 
                  onClick={() => disconnectStore(store.id, store.store_name)}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
                >
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
                  onKeyPress={(e) => e.key === 'Enter' && connectShopify()}
                  placeholder="your-store-name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            >
              {connecting ? 'Connecting...' : 'Connect Store'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">More Platforms Coming Soon</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {['WooCommerce', 'Wix', 'BigCommerce', 'Squarespace', 'Magento', 'OpenCart', 'Etsy', 'Amazon Seller'].map((platform) => (
            <div key={platform} className="bg-gray-100 rounded-xl p-4 text-center opacity-60">
              <div className="text-2xl mb-2">🔜</div>
              <p className="text-sm text-gray-600">{platform}</p>
            </div>
          ))}
        </div>
      </div>

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
