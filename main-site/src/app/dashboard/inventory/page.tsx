'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function InventoryPage() {
  const { user } = useAuth()
  const [stores, setStores] = useState<any[]>([])
  const [selectedStore, setSelectedStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Fetch user's stores
  useEffect(() => {
    if (user) {
      // First get the Shopify platform UUID
      supabase
        .from('platforms')
        .select('id')
        .eq('slug', 'shopify')
        .single()
        .then(({ data: platform, error: platformError }) => {
          if (platformError || !platform) {
            console.error('Platform lookup error:', platformError)
            setLoading(false)
            return
          }

          // Now fetch stores with the correct platform UUID
          supabase
            .from('stores')
            .select('*')
            .eq('user_id', user.id)
            .eq('platform_id', platform.id)
            .then(({ data, error }) => {
              setStores(data || [])
              if (data && data.length > 0) {
                setSelectedStore(data[0])
              }
              setLoading(false)
            })
        })
    }
  }, [user])

  // Fetch products when store is selected
  useEffect(() => {
    if (selectedStore) {
      fetchProducts()
    }
  }, [selectedStore])

  const fetchProducts = async () => {
    if (!selectedStore) return
    
    setLoadingProducts(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/shopify/products?storeId=${selectedStore.id}`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        setProducts([])
      } else {
        setProducts(data.products || [])
      }
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError('Failed to fetch products')
      setProducts([])
    }
    
    setLoadingProducts(false)
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

  if (stores.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores connected</h3>
          <p className="text-gray-600 mb-6">Connect a Shopify store to manage inventory</p>
          <a href="/dashboard/stores" className="inline-block px-6 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors">
            Connect Store
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        
        {/* Store Selector */}
        {stores.length > 1 && (
          <select
            value={selectedStore?.id || ''}
            onChange={(e) => {
              const store = stores.find(s => s.id === e.target.value)
              setSelectedStore(store)
            }}
            className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.store_name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.variants?.[0]?.inventory_quantity > 0).length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => p.variants?.[0]?.inventory_quantity <= 0).length}
              </p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <button
            onClick={fetchProducts}
            disabled={loadingProducts}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loadingProducts ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {loadingProducts ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inventory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const variant = product.variants?.[0]
                  const inventory = variant?.inventory_quantity || 0
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image?.src ? (
                            <img src={product.image.src} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                              📷
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{product.title}</p>
                            <p className="text-sm text-gray-500">{product.vendor}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {variant?.sku || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${variant?.price || '0.00'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${inventory > 10 ? 'text-green-600' : inventory > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                          {inventory}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {inventory > 10 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">In Stock</span>
                        ) : inventory > 0 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">Low Stock</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Out of Stock</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📦</div>
            <p>No products found in this store</p>
          </div>
        )}
      </div>
    </div>
  )
}
