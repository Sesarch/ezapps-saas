'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Products', href: '/dashboard/products' },
  { name: 'Parts', href: '/dashboard/parts' },
  { name: 'Suppliers', href: '/dashboard/suppliers' },
  { name: 'BOM', href: '/dashboard/bom' },
  { name: 'Orders', href: '/dashboard/orders' },
  { name: 'Purchase Orders', href: '/dashboard/purchase-orders' },
  { name: 'Build Orders', href: '/dashboard/build-orders' },
  { name: 'Stores', href: '/dashboard/stores' },
  { name: 'Billing', href: '/dashboard/billing' },
  { name: 'Settings', href: '/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard">
          <Image 
            src="/logo.png" 
            alt="EZ Apps" 
            width={120} 
            height={32}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 mb-1 rounded-lg text-sm ${
                isActive 
                  ? 'bg-[#F5DF4D] text-gray-900 font-medium' 
                  : 'text-[#97999B] hover:bg-[#F0EEE9]'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link href="/login" className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
          Sign Out
        </Link>
      </div>
    </div>
  )
}
