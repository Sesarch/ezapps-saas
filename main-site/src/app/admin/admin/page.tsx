'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    activeSubscriptions: 0,
    trialUsers: 0,
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch total stores
      const { count: storesCount } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })

      // Fetch subscriptions
      const { count: activeSubsCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const { count: trialCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'trialing')

      // Fetch recent users
      const { data: recent } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalUsers: usersCount || 0,
        totalStores: storesCount || 0,
        activeSubscriptions: activeSubsCount || 0,
        trialUsers: trialCount || 0,
      })
      setRecentUsers(recent || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome to the EZ Apps admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
          <p className="text-xs text-green-400 mt-3">↑ All registered users</p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Connected Stores</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalStores}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl">
              🏪
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Active store connections</p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Subscriptions</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.activeSubscriptions}</p>
            </div>
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center text-2xl">
              💳
            </div>
          </div>
          <p className="text-xs text-green-400 mt-3">Paid subscriptions</p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Trial Users</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.trialUsers}</p>
            </div>
            <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center text-2xl">
              ⏳
            </div>
          </div>
          <p className="text-xs text-amber-400 mt-3">On free trial</p>
        </div>
      </div>

      {/* Recent Users & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Recent Users</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.full_name || 'No name'}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No users yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <a href="/admin/users" className="flex items-center gap-4 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-xl">👥</div>
              <div>
                <p className="font-medium text-white">Manage Users</p>
                <p className="text-sm text-gray-400">View and edit user accounts</p>
              </div>
            </a>
            <a href="/admin/subscriptions" className="flex items-center gap-4 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-xl">💳</div>
              <div>
                <p className="font-medium text-white">View Subscriptions</p>
                <p className="text-sm text-gray-400">Monitor revenue and plans</p>
              </div>
            </a>
            <a href="/admin/plans" className="flex items-center gap-4 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl">📋</div>
              <div>
                <p className="font-medium text-white">Edit Plans</p>
                <p className="text-sm text-gray-400">Update pricing and features</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
