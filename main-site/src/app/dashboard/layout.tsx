'use client'

export const dynamic = 'force-dynamic'

import { useAuth } from '@/components/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Move createClient INSIDE useEffect
    const supabase = createClient()
    
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Inventory', href: '/dashboard/inventory', icon: '📦' },
    { name: 'Orders', href: '/dashboard/orders', icon: '🛒' },
    { name: 'BOM', href: '/dashboard/bom', icon: '📋' },
    { name: 'Builds', href: '/dashboard/builds', icon: '🔨' },
    { name: 'Parts', href: '/dashboard/parts', icon: '⚙️' },
    { name: 'Suppliers', href: '/dashboard/suppliers', icon: '🏭' },
    { name: 'Purchase Orders', href: '/dashboard/purchase-orders', icon: '📝' },
    { name: 'Stores', href: '/dashboard/stores', icon: '🏪' },
    { name: 'Items', href: '/dashboard/items', icon: '📱' },
    { name: 'Apps', href: '/dashboard/apps', icon: '🎯' },
    { name: 'Scanner', href: '/dashboard/scan', icon: '📷' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <span className="font-bold text-white">EZ Apps</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-800 border-r border-gray-700
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 h-16 px-6 border-b border-gray-700">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-bold text-white">EZ Apps</p>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                  <p className="text-xs text-teal-400">User</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="mr-3">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
