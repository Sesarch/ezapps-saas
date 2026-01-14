'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import PlatformSwitcher from '@/components/PlatformSwitcher'
import { platforms } from '@/config/platforms'

function DashboardContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userPlatforms, setUserPlatforms] = useState<string[]>(['shopify'])
  const [isBundle, setIsBundle] = useState(false)
  
  // Get current platform from URL param or default to shopify
  const currentPlatformId = searchParams.get('platform') || 'shopify'
  const currentPlatform = platforms[currentPlatformId]
  
  // Platform theme colors
  const themeColor = currentPlatform?.colors.primary || '#F5DF4D'

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div 
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: themeColor, borderTopColor: 'transparent' }}
          ></div>
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
    { name: 'Stores', href: '/dashboard/stores', icon: '🏪' },
    { name: 'Products', href: '/dashboard/inventory', icon: '📦' },
    { name: 'Parts', href: '/dashboard/parts', icon: '🔧' },
    { name: 'Suppliers', href: '/dashboard/suppliers', icon: '🚚' },
    { name: 'BOM', href: '/dashboard/bom', icon: '📋' },
    { name: 'Orders', href: '/dashboard/orders', icon: '🛒' },
    { name: 'Purchase Orders', href: '/dashboard/purchase-orders', icon: '📝' },
    { name: 'Build Orders', href: '/dashboard/builds', icon: '🏭' },
    { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  // Add platform param to nav links
  const getNavHref = (href: string) => {
    return `${href}?platform=${currentPlatformId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div 
        className="lg:hidden border-b px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: `${themeColor}10`, borderColor: `${themeColor}30` }}
      >
        <Link href={`/dashboard?platform=${currentPlatformId}`}>
          <img src="/logo.png" alt="EZ Apps" className="h-8" />
        </Link>
        <div className="flex items-center gap-2">
          {/* Mobile Platform Indicator */}
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
            style={{ backgroundColor: themeColor }}
          >
            {currentPlatform?.icon || '🏪'}
          </div>
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
            {/* Logo & Platform Switcher */}
            <div className="hidden lg:block border-b border-gray-200">
              <div className="flex items-center h-16 px-6">
                <Link href={`/dashboard?platform=${currentPlatformId}`}>
                  <img src="/logo.png" alt="EZ Apps" className="h-8" />
                </Link>
              </div>
              
              {/* Platform Switcher */}
              <div className="px-4 pb-4">
                <PlatformSwitcher 
                  currentPlatformId={currentPlatformId}
                  userPlatforms={userPlatforms}
                  isBundle={isBundle}
                />
              </div>
            </div>

            {/* Mobile Platform Switcher */}
            <div className="lg:hidden px-4 py-4 border-b border-gray-200">
              <PlatformSwitcher 
                currentPlatformId={currentPlatformId}
                userPlatforms={userPlatforms}
                isBundle={isBundle}
              />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={getNavHref(item.href)}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={{
                      backgroundColor: isActive ? `${themeColor}20` : undefined
                    }}
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
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: themeColor }}
                  >
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500">Free Trial</p>
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  )
}
