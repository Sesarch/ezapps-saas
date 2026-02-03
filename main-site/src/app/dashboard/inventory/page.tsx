'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Stats {
  totalProducts: number
  totalItems: number
  totalBoms: number
  lowStockItems: number
}

export default function InventoryOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalItems: 0,
    totalBoms: 0,
    lowStockItems: 0
  })
  const [loading, setLoading] = useState(true)
  const [hasStore, setHasStore] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Check if user has stores
      const { data: stores } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (!stores || stores.length === 0) {
        setHasStore(false)
        setLoading(false)
        return
      }

      setHasStore(true)
      const storeIds = stores.map(s => s.id)

      // Get items count
      const { data: items } = await supabase
        .from('items')
        .select('id, current_stock, min_stock')
        .in('store_id', storeIds)

      // Get BOM count
      const { data: boms } = await supabase
        .from('bom_items')
        .select('id')
        .eq('user_id', user.id)

      const lowStock = items?.filter(item => item.current_stock <= item.min_stock).length || 0

      setStats({
        totalProducts: 0, // Will be fetched from products page
        totalItems: items?.length || 0,
        totalBoms: boms?.length || 0,
        lowStockItems: lowStock
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!hasStore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-teal-100"
          >
            <div className="text-8xl mb-6">📦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Inventory Management App
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect a store to start using the Inventory app
            </p>
            
            <div className="bg-teal-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-teal-900 mb-3">📋 What's Inside?</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ <strong>Products</strong> - Sync from your store platforms</li>
                <li>✓ <strong>Items</strong> - Manage internal inventory</li>
                <li>✓ <strong>BOM</strong> - Link products to components</li>
                <li>✓ <strong>Orders</strong> - Track fulfillment</li>
                <li>✓ <strong>Parts & Suppliers</strong> - Full supply chain</li>
              </ul>
            </div>

            <Link
              href="/dashboard/stores"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all hover:scale-105"
            >
              🚀 Connect Your First Store
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              Supports: Shopify • WooCommerce • Wix • Etsy • and more
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  const features = [
    {
      title: 'Products',
      description: 'Sync products from your connected stores',
      icon: '📦',
      href: '/dashboard/inventory/products',
      color: 'from-blue-500 to-blue-600',
      stat: `${stats.totalProducts} synced`
    },
    {
      title: 'Items',
      description: 'Manage internal inventory items',
      icon: '📱',
      href: '/dashboard/inventory/items',
      color: 'from-purple-500 to-purple-600',
      stat: `${stats.totalItems} items`
    },
    {
      title: 'Bill of Materials',
      description: 'Link products to required components',
      icon: '📋',
      href: '/dashboard/inventory/bom',
      color: 'from-teal-500 to-teal-600',
      stat: `${stats.totalBoms} entries`
    },
    {
      title: 'Parts',
      description: 'Manage individual parts inventory',
      icon: '🔧',
      href: '/dashboard/inventory/parts',
      color: 'from-orange-500 to-orange-600',
      stat: 'Manage parts'
    },
    {
      title: 'Suppliers',
      description: 'Track your suppliers and vendors',
      icon: '🏭',
      href: '/dashboard/inventory/suppliers',
      color: 'from-green-500 to-green-600',
      stat: 'View suppliers'
    },
    {
      title: 'Orders',
      description: 'Monitor order fulfillment',
      icon: '🛒',
      href: '/dashboard/inventory/orders',
      color: 'from-indigo-500 to-indigo-600',
      stat: 'Track orders'
    },
    {
      title: 'Purchase Orders',
      description: 'Manage purchase orders',
      icon: '📝',
      href: '/dashboard/inventory/purchase-orders',
      color: 'from-pink-500 to-pink-600',
      stat: 'Create POs'
    },
    {
      title: 'QR Scanner',
      description: 'Scan items with QR codes',
      icon: '📷',
      href: '/dashboard/inventory/scan',
      color: 'from-cyan-500 to-cyan-600',
      stat: 'Scan now'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            📦 Inventory Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage products, items, and supply chain in one place
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalItems}</p>
              </div>
              <div className="text-4xl">📱</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">BOM Entries</p>
                <p className="text-3xl font-bold text-teal-600">{stats.totalBoms}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-3xl font-bold text-orange-600">{stats.lowStockItems}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-bold text-green-600">✓ Active</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-500 h-full"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    {feature.stat}
                  </span>
                  <span className="text-teal-500 text-xl group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
