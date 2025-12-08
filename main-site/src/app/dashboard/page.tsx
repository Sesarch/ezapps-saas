'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [apps, setApps] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setProfile(data))

      supabase
        .from('apps')
        .select('*')
        .eq('is_active', true)
        .then(({ data }) => setApps(data || []))
    }
  }, [user])

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
              <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
            </div>
            <div className="text-3xl">🏪</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Apps</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-2xl font-bold text-teal-600 mt-1">Trial</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Days Left</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">14</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#97999B] to-cyan-500 rounded-2xl p-6 mb-8 text-white">
        <h2 className="text-xl font-bold mb-2">Get Started</h2>
        <p className="mb-4 opacity-90">Connect your first store to start using EZ Apps</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/stores" className="inline-block px-5 py-2.5 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Connect Store
          </Link>
          <Link href="/dashboard/apps" className="inline-block px-5 py-2.5 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
            Browse Apps
          </Link>
        </div>
      </div>

      {/* Available Apps Preview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Available Apps</h2>
          <Link href="/dashboard/apps" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
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
          <p className="text-gray-600">No recent activity yet</p>
          <p className="text-gray-400 text-sm mt-1">Connect a store to get started</p>
        </div>
      </div>
    </div>
  )
}
