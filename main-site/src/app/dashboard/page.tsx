'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Growth',
    appsAllowed: 3,
    appsUsed: 1,
  })

  const apps = [
    { id: 'inventory', name: 'Inventory Management', icon: '📦', active: true },
    { id: 'loyalty', name: 'Loyalty Program', icon: '🎁', active: false },
    { id: 'reviews', name: 'Review Manager', icon: '⭐', active: false },
    { id: 'upsell', name: 'Upsell Engine', icon: '📈', active: false },
    { id: '3d-viewer', name: '3D Model Viewer', icon: '🎨', active: false },
    { id: 'form-builder', name: 'EZ Form Builder', icon: '📝', active: false },
  ]

  const platforms = [
    { id: 'shopify', name: 'Shopify', connected: true, stores: 1 },
    { id: 'woocommerce', name: 'WooCommerce', connected: false, stores: 0 },
    { id: 'wix', name: 'Wix', connected: false, stores: 0 },
    { id: 'bigcommerce', name: 'BigCommerce', connected: false, stores: 0 },
    { id: 'squarespace', name: 'SquareSpace', connected: false, stores: 0 },
    { id: 'magento', name: 'Magento', connected: false, stores: 0 },
    { id: 'opencart', name: 'OpenCart', connected: false, stores: 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">EZ</span>
              </div>
              <span className="text-2xl font-display font-bold text-gray-900">Apps</span>
            </Link>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.plan} Plan</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-custom py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your apps and connected stores from your dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Apps Active</span>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {user.appsUsed}/{user.appsAllowed}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Platforms</span>
              <span className="text-2xl">🏪</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {platforms.filter(p => p.connected).length}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Stores</span>
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {platforms.reduce((sum, p) => sum + p.stores, 0)}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Current Plan</span>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-xl font-bold text-primary-600">{user.plan}</p>
            <Link href="/pricing" className="text-xs text-primary-600 hover:underline">
              Upgrade plan
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Apps */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  Your Apps
                </h2>
                <span className="text-sm text-gray-500">
                  {user.appsUsed} of {user.appsAllowed} apps activated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                      app.active
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-3xl">{app.icon}</div>
                      {app.active ? (
                        <span className="px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
                          Active
                        </span>
                      ) : (
                        <button
                          disabled={user.appsUsed >= user.appsAllowed}
                          className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{app.name}</h3>
                    {app.active && (
                      <button className="text-primary-600 text-sm font-semibold hover:underline">
                        Manage →
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {user.appsUsed >= user.appsAllowed && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    You've reached your app limit. 
                    <Link href="/pricing" className="font-semibold hover:underline ml-1">
                      Upgrade your plan
                    </Link>
                    {' '}to activate more apps.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Connected Platforms */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
                Platforms
              </h2>

              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      platform.connected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{platform.name}</h3>
                      {platform.connected ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <button
                          onClick={() => {
                            window.location.href = `https://${platform.id}.ezapps.app/connect`
                          }}
                          className="text-primary-600 text-sm font-semibold hover:underline"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                    {platform.connected && (
                      <p className="text-sm text-gray-600">
                        {platform.stores} {platform.stores === 1 ? 'store' : 'stores'} connected
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
