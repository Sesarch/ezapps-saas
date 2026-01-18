'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { platforms } from '@/config/platforms'
import { createClient } from '@/lib/supabase/client'

function PlatformSelectionContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [connectedStores, setConnectedStores] = useState<any[]>([])
  const [loadingStores, setLoadingStores] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadConnectedStores()
    }
  }, [user, loading, router])

  const loadConnectedStores = async () => {
    const supabase = createClient()
    const { data, error} = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', user?.id)

    if (!error && data) {
      setConnectedStores(data)
      
      // If user has only one store, redirect to that platform automatically
      if (data.length === 1) {
        const platformId = data[0].platform_id
        redirectToPlatform(platformId)
      }
    }
    setLoadingStores(false)
  }

  const redirectToPlatform = (platformId: string) => {
    // Check if we're in production or development
    const hostname = window.location.hostname
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')
    
    if (isLocalhost) {
      // In development, just navigate to dashboard with platform context
      router.push('/dashboard')
    } else {
      // In production, redirect to platform subdomain
      window.location.href = `https://${platformId}.ezapps.app/dashboard`
    }
  }

  if (loading || loadingStores) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your platforms...</p>
        </div>
      </div>
    )
  }

  const availablePlatforms = Object.keys(platforms).map(id => ({
    id,
    ...platforms[id],
    connected: connectedStores.some(s => s.platform_id === id)
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EZ Apps" className="h-8" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Platform
          </h1>
          <p className="text-xl text-gray-600">
            Choose which e-commerce platform you want to manage
          </p>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePlatforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => {
                if (platform.connected) {
                  redirectToPlatform(platform.id)
                } else {
                  // Not yet connected - go to stores page to connect
                  router.push('/dashboard/stores')
                }
              }}
              disabled={!platform.connected}
              className={`relative bg-white rounded-2xl border-2 p-8 transition-all group ${
                platform.connected 
                  ? 'border-gray-300 hover:border-gray-400 hover:shadow-lg cursor-pointer'
                  : 'border-gray-200 opacity-60 cursor-not-allowed'
              }`}
              style={{
                borderColor: platform.connected ? platform.colors.primary : undefined,
                backgroundColor: platform.connected ? `${platform.colors.primary}05` : undefined
              }}
            >
              {/* Connected Badge */}
              {platform.connected && (
                <div 
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: platform.colors.primary }}
                >
                  Connected
                </div>
              )}

              {platform.connected ? (
                <>
                  {/* Platform Icon */}
                  <div className="flex justify-center mb-6">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                      style={{ backgroundColor: `${platform.colors.primary}20` }}
                    >
                      {platform.icon}
                    </div>
                  </div>

                  {/* Platform Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Click to open dashboard
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{ backgroundColor: platform.colors.primary }}
                  ></div>
                </>
              ) : (
                <>
                  {/* Platform Icon - Disabled */}
                  <div className="flex justify-center mb-6">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl grayscale"
                      style={{ backgroundColor: `${platform.colors.primary}20` }}
                    >
                      {platform.icon}
                    </div>
                  </div>

                  {/* Platform Info - Coming Soon */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Coming Soon
                    </p>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Help Text */}
        {connectedStores.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              No platforms connected yet
            </p>
            <button
              onClick={() => router.push('/dashboard/stores')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors"
            >
              Connect Your First Platform
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? <a href="/contact" className="text-teal-600 hover:text-teal-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AddPlatformPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PlatformSelectionContent />
    </Suspense>
  )
}

