'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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

  // Organized navigation with groups - UPDATED!
  const navigationGroups = [
    {
      name: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Stores', href: '/dashboard/stores', icon: '🏪' },
      ]
    },
    {
  name: 'Inventory',
  items: [
    { name: 'Products', href: '/dashboard/inventory', icon: '📦' },
    { name: 'Items', href: '/dashboard/items', icon: '📱' },
    { name: 'BOM', href: '/dashboard/bom', icon: '📋' },
  ]
},
    {
      name: 'Operations',
      items: [
        { name: 'Orders', href: '/dashboard/orders', icon: '🛒' },
        { name: 'Purchase Orders', href: '/dashboard/purchase-orders', icon: '📝' },
        { name: 'Suppliers', href: '/dashboard/suppliers', icon: '🏭' },
      ]
    },
    {
      name: 'Tools',
      items: [
        { name: 'Apps', href: '/dashboard/apps', icon: '🎯' },
        { name: 'Scanner', href: '/dashboard/scan', icon: '📷' },
      ]
    },
    {
      name: 'Account',
      items: [
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
        { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
      ]
    },
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
          w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 h-16 px-6 border-b border-gray-700/50">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">📦</span>
              </div>
              <div>
                <p className="font-bold text-white text-lg">EZ Apps</p>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>

            {/* Navigation with Groups */}
            <nav className="flex-1 px-3 py-6 space-y-5 overflow-y-auto">
              {navigationGroups.map((group) => (
                <div key={group.name}>
                  {/* Group Label */}
                  <div className="px-3 mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {group.name}
                    </p>
                  </div>
                  
                  {/* Group Items in Modern Card */}
                  <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-2 space-y-1 border border-gray-600/20 shadow-lg">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/20 scale-[1.02]'
                              : 'text-gray-300 hover:bg-gray-600/40 hover:text-white hover:scale-[1.01]'
                          }`}
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-800/50">
              <div className="flex items-center mb-3 bg-gray-700/30 rounded-xl p-3 border border-gray-600/20">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 overflow-hidden flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                  <p className="text-xs text-teal-400">Active User</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white bg-gray-700/30 hover:bg-red-600/20 border border-gray-600/20 hover:border-red-500/30 rounded-xl transition-all duration-200"
              >
                <span className="mr-2">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
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
