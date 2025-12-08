'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useStore } from '@/contexts/StoreContext'
import { createClient } from '@/lib/supabase'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Products', href: '/dashboard/products', icon: '📦' },
  { name: 'Parts', href: '/dashboard/parts', icon: '🔧' },
  { name: 'Suppliers', href: '/dashboard/suppliers', icon: '🚚' },
  { name: 'BOM', href: '/dashboard/bom', icon: '📋' },
  { name: 'Orders', href: '/dashboard/orders', icon: '🛒' },
  { name: 'Purchase Orders', href: '/dashboard/purchase-orders', icon: '📝' },
  { name: 'Build Orders', href: '/dashboard/build-orders', icon: '🔨' },
  { name: 'Stores', href: '/dashboard/stores', icon: '🏪' },
  { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { currentStore, userEmail } = useStore()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard">
          <Image 
            src="/logo.png" 
            alt="EZ Apps" 
            width={140} 
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-[#F5DF4D]/20 text-gray-900 font-medium border-l-4 border-[#F5DF4D]' 
                  : 'text-[#97999B] hover:bg-[#F0EEE9] hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-100">
        {currentStore && (
          <div className="mb-4 p-3 bg-[#F0EEE9] rounded-lg">
            <p className="text-xs text-[#97999B] uppercase tracking-wider">Connected Store</p>
            <p className="text-sm font-medium text-gray-900 truncate mt-1">
              {currentStore.store_url.replace('.myshopify.com', '')}
            </p>
          </div>
        )}
        
        {userEmail && (
          <div className="mb-4">
            <p className="text-xs text-[#97999B] truncate">{userEmail}</p>
            <span className="inline-block mt-1 text-xs bg-[#F5DF4D] text-gray-900 px-2 py-0.5 rounded-full">
              Free Trial
            </span>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-[#97999B] rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
