'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [apps, setApps] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard">
              <img src="/logo.png" alt="EZ Apps" className="h-8" />
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-teal-600 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/billing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Billing
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <span className="text-gray-600 text-sm">{profile?.full_name || user.email}</span>
                <button 
                  onClick={signOut}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Manage your e-commerce apps from one place</p>
        </div>

        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-2">Your Free Trial is Active</h2>
          <p className="mb-4 opacity-90">You have 14 days to explore all features. No credit card required.</p>
          <Link href="/dashboard/billing" className="inline-block px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            View Plans
          </Link>
        </div>

        {/* Apps Grid */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{app.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{app.description}</p>
              <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        {/* Connect Store */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Stores</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🏪</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores connected yet</h3>
            <p className="text-gray-600 mb-4">Connect your first store to get started</p>
            <button className="px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors">
              Connect Store
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
