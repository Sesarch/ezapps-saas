'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  shopify_order_id: string
  order_number: string
  order_name: string
  customer_name: string | null
  customer_email: string | null
  total_price: number
  fulfillment_status: string | null
  financial_status: string | null
  can_fulfill: boolean
  missing_parts: string | null
  order_date: string
}

interface Store {
  id: string
  store_url: string
  access_token: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'unfulfilled' | 'fulfilled'>('all')

  const supabase = createClient()

  useEffect(() => {
    fetchStore()
  }, [])

  useEffect(() => {
    if (store) {
      fetchOrders()
    }
  }, [store])

  async function fetchStore() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)

      if (stores && stores.length > 0) {
        setStore(stores[0])
      } else {
        setError('Please connect a store first')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error fetching store:', err)
      setLoading(false)
    }
  }

  async function fetchOrders() {
    if (!store) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shopify_orders')
        .select('*')
        .eq('store_id', store.id)
        .order('order_date', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  async function syncOrders() {
    if (!store) return
    setSyncing(true)
    
    try {
      const response = await fetch(`https://ezapps.app/api/shopify/orders?store=${store.store_url}`)
      
      if (!response.ok) {
        alert('Error: Failed to connect to Shopify API')
        setSyncing(false)
        return
      }
      
      const data = await response.json()
      
      if (data.error) {
        alert('Error: ' + data.error)
        setSyncing(false)
        return
      }
      
      // Handle successful response
      const ordersCount = data.orders?.length || 0
      
      if (ordersCount === 0) {
        alert('✅ Successfully synced! No orders found in your Shopify store.')
        setSyncing(false)
        return
      }
      
      // Process orders if there are any
      for (const order of data.orders) {
        const orderData = {
          store_id: store.id,
          shopify_order_id: order.id.toString(),
          order_number: order.order_number?.toString() || '',
          order_name: order.name || '',
          customer_name: order.customer?.first_name 
            ? `${order.customer.first_name} ${order.customer.last_name || ''}`.trim()
            : null,
          customer_email: order.customer?.email || null,
          total_price: parseFloat(order.total_price) || 0,
          fulfillment_status: order.fulfillment_status || 'unfulfilled',
          financial_status: order.financial_status || null,
          order_date: order.created_at,
          updated_at: new Date().toISOString()
        }

        await supabase
          .from('shopify_orders')
          .upsert(orderData, { onConflict: 'store_id,shopify_order_id' })
      }
      
      await fetchOrders()
      alert(`✅ Successfully synced ${ordersCount} order${ordersCount === 1 ? '' : 's'}!`)
      
    } catch (err) {
      console.error('Error syncing orders:', err)
      alert('Error: Could not connect to the server')
    } finally {
      setSyncing(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'unfulfilled') return !order.fulfillment_status || order.fulfillment_status === 'unfulfilled'
    if (filter === 'fulfilled') return order.fulfillment_status === 'fulfilled'
    return true
  })

  const unfulfilledCount = orders.filter(o => !o.fulfillment_status || o.fulfillment_status === 'unfulfilled').length
  const fulfilledCount = orders.filter(o => o.fulfillment_status === 'fulfilled').length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0)

  if (loading && !store) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !store) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          {error}. <a href="/dashboard/stores" className="underline">Go to Stores</a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Sync and manage orders from Shopify</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
            </div>
            <div className="text-3xl">🛒</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unfulfilled</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{unfulfilledCount}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fulfilled</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{fulfilledCount}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-teal-600 mt-1">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilter('unfulfilled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unfulfilled' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unfulfilled ({unfulfilledCount})
            </button>
            <button
              onClick={() => setFilter('fulfilled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'fulfilled' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Fulfilled ({fulfilledCount})
            </button>
          </div>

          <button
            onClick={syncOrders}
            disabled={syncing}
            className="flex items-center px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium disabled:opacity-50"
          >
            {syncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Syncing...
              </>
            ) : (
              <>
                <span className="mr-2">🔄</span> Sync Orders
              </>
            )}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">
              {orders.length === 0 ? 'Click "Sync Orders" to import from Shopify' : 'No orders match this filter'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">ORDER</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">CUSTOMER</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">DATE</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">TOTAL</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">PAYMENT</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">FULFILLMENT</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">CAN FULFILL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{order.order_name}</p>
                      <p className="text-sm text-gray-500">#{order.order_number}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900">{order.customer_name || 'Guest'}</p>
                      <p className="text-sm text-gray-500">{order.customer_email || '-'}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">
                      ${order.total_price?.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.financial_status === 'paid' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.financial_status || 'pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.fulfillment_status === 'fulfilled'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.fulfillment_status || 'unfulfilled'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {order.can_fulfill ? (
                        <span className="text-green-600 text-xl">✅</span>
                      ) : (
                        <span className="text-red-600 text-xl" title={order.missing_parts || 'Missing parts'}>❌</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
