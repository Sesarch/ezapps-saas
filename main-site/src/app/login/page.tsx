'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllPlatforms, platforms } from '@/config/platforms'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('shopify')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const allPlatforms = getAllPlatforms()
  const currentPlatform = platforms[selectedPlatform]

  // Check for platform param in URL
  useEffect(() => {
    const platformParam = searchParams.get('platform')
    if (platformParam && platforms[platformParam]) {
      setSelectedPlatform(platformParam)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    
    if (data.user) {
      // Check user's subscription for platform access
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('platforms, is_bundle, status')
        .eq('user_id', data.user.id)
        .eq('status', 'active')
        .single()

      // Determine if user has access to selected platform
      const hasAccess = subscription?.is_bundle || 
                        subscription?.platforms?.includes(selectedPlatform) ||
                        selectedPlatform === 'shopify' // Default access for existing users

      if (hasAccess) {
        // Redirect to platform subdomain
        const platform = platforms[selectedPlatform]
        if (platform.status === 'active') {
          // For production, redirect to subdomain
          // window.location.href = `https://${platform.subdomain}/dashboard`
          // For now, just go to dashboard with platform param
          router.push(`/dashboard?platform=${selectedPlatform}`)
        } else {
          setError(`${platform.displayName} is coming soon! Please select an active platform.`)
          setLoading(false)
          return
        }
      } else {
        // User doesn't have access to this platform
        router.push(`/add-platform?platform=${selectedPlatform}`)
      }
      
      router.refresh()
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo.png" alt="EZ Apps" className="h-10 mx-auto mb-4" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="john@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="Enter your password"
              />
            </div>

            {/* Platform Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Platform
              </label>
              <div className="relative">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white"
                  style={{ 
                    borderLeftWidth: '4px',
                    borderLeftColor: currentPlatform?.colors.primary 
                  }}
                >
                  {allPlatforms.map((platform) => (
                    <option 
                      key={platform.id} 
                      value={platform.id}
                      disabled={platform.status === 'coming_soon'}
                    >
                      {platform.icon} {platform.displayName}
                      {platform.status === 'coming_soon' ? ' (Coming Soon)' : ''}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Platform Preview */}
              {currentPlatform && (
                <div 
                  className="mt-2 p-3 rounded-lg flex items-center gap-3"
                  style={{ backgroundColor: `${currentPlatform.colors.primary}15` }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: currentPlatform.colors.primary }}
                  >
                    {currentPlatform.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{currentPlatform.displayName}</p>
                    <p className="text-xs text-gray-500">
                      {currentPlatform.status === 'active' 
                        ? '✅ Ready to use' 
                        : '🕐 Coming soon'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || currentPlatform?.status === 'coming_soon'}
              className="w-full py-3 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              style={{ 
                backgroundColor: currentPlatform?.colors.primary || '#14B8A6',
              }}
            >
              {loading ? 'Signing in...' : `Sign In to ${currentPlatform?.displayName || 'EZ Apps'}`}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href={`/signup?platform=${selectedPlatform}`} 
              className="font-medium hover:underline"
              style={{ color: currentPlatform?.colors.primary || '#14B8A6' }}
            >
              Sign up free
            </Link>
          </p>
        </div>

        {/* Platform badges */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-3">Available platforms</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {allPlatforms.map((platform) => (
              <div
                key={platform.id}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                  platform.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {platform.icon}
                {platform.name}
                {platform.status === 'coming_soon' && (
                  <span className="text-[10px] opacity-70">soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
