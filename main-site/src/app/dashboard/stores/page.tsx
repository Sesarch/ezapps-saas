'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function StoresPage() {
  const { user } = useAuth()
  const [stores, setStores] = useState<any[]>([])
  const [platforms, setPlatforms] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Fetch platforms
    supabase
      .from('platforms')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => setPlatforms(data || []))

    // Fetch user's stores
    if (user) {
      supabase
        .from('stores')
        .select('*, platforms(*)')
        .eq('user_id', user.id)
        .then(({ data }) => setStores(data || []))
    }
  }, [user])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Connected Stores</h1>
        <p className="text-gray-600 mt-1">Manage your e-commerce store connections</p>
      </div>

      {/* Connected Stores */}
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={store.platforms?.logo_url} alt={store.platforms?.name} className="w-10 h-10 object-contain" />
                <div>
                  <h3 className="font-semibold text-gray-900">{store.store_name}</h3>
                  <p className="text-sm text-gray-500">{store.platforms?.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="flex items-center text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Connected
                </span>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  Settings
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

      {/* Available Platforms */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect a Store</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-teal-500 hover:shadow-md transition-all text-left group"
            >
              <img src={platform.logo_url} alt={platform.name} className="h-10 object-contain mb-4" />
              <h3 className="font-semibold text-gray-900 mb-1">{platform.name}</h3>
              <p className="text-sm text-gray-500 group-hover:text-teal-600">Click to connect →</p>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">🔒</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Secure Connection</h3>
            <p className="text-gray-600 text-sm">
              We use OAuth to securely connect to your store. We never store your password and you can disconnect at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
