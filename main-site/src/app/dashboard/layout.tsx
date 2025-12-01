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
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Inventory', href: '/dashboard/inventory', icon: '📦' },
    { name: 'Stores', href: '/dashboard/stores', icon: '🏪' },
    { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard">
          <img src="/logo.png" alt="EZ Apps" className="h-8" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center h-16 px-6 border-b border-gray-200">
              <Link href="/dashboard">
                <img src="/logo.png" alt="EZ Apps" className="h-8" />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}

              {/* Divider */}
              <div className="my-4 border-t border-gray-200"></div>

              {/* User Section */}
              <div className="px-4 py-3">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    <p className="text-xs text-teal-600">Free Trial</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">🚪</span>
                  Sign Out
                </button>
              </div>
            </nav>
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
        <main className="flex-1 min-h-screen lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  )
}
