'use client'
export const dynamic = 'force-dynamic'
import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [apps, setApps] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [subscription, setSubscription] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      // Fetch profile
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setProfile(data))

      // Fetch apps
      supabase
        .from('apps')
        .select('*')
        .eq('is_active', true)
        .then(({ data }) => setApps(data || []))

      // Fetch connected stores (exclude disconnected)
      supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'disconnected')
        .then(({ data }) => setStores(data || []))

      // Fetch subscription
      supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
        .then(({ data }) => setSubscription(data))
    }
  }, [user])

  // Calculate days left in trial (14 days from signup)
  const getDaysLeft = () => {
    if (subscription) return null // Has active subscription
    if (!profile?.created_at) return 14
    const created = new Date(profile.created_at)
    const now = new Date()
    const diffDays = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, 14 - diffDays)
  }

  const daysLeft = getDaysLeft()

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Connected Stores</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stores.length}</p>
            </div>
            <div className="text-3xl">🏪</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Apps</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{apps.length}</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-2xl font-bold text-[#97999B] mt-1">
                {subscription?.plans?.name || 'Trial'}
              </p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Days Left</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {daysLeft !== null ? daysLeft : '∞'}
              </p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Connected Stores */}
      {stores.length === 0 ? (
        <div className="bg-gradient-to-r from-[#97999B] to-[#F5DF4D] rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-2">Get Started</h2>
          <p className="mb-4 opacity-90">Connect your first store to start using EZ Apps</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/stores" className="inline-block px-5 py-2.5 bg-white text-[#97999B] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Connect Store
            </Link>
            <Link href="/dashboard/apps" className="inline-block px-5 py-2.5 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
              Browse Apps
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Connected Stores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <div key={store.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🛍️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{store.store_url}</p>
                    <p className="text-sm text-gray-500 capitalize">{store.platform_id || 'Shopify'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                    <Link href="/dashboard/stores" className="px-3 py-1.5 bg-[#F5DF4D] text-gray-800 text-xs font-medium rounded-lg hover:bg-[#e5cf3d] transition-colors">
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Apps Preview */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Available Apps</h2>
          <Link href="/dashboard/apps" className="px-4 py-2 bg-[#F5DF4D] text-gray-800 text-sm font-medium rounded-lg hover:bg-[#e5cf3d] transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.slice(0, 3).map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{app.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{app.name}</h3>
              <p className="text-gray-600 text-sm">{app.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          {stores.length === 0 ? (
            <>
              <p className="text-gray-600">No recent activity yet</p>
              <p className="text-gray-400 text-sm mt-1">Connect a store to get started</p>
            </>
          ) : (
            <>
              <p className="text-gray-600">Your stores are connected!</p>
              <p className="text-gray-400 text-sm mt-1">Activity will appear here as you use the apps</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
