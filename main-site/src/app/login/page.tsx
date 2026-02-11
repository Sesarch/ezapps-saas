'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log('🔑 Starting login for:', email)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('❌ Login error:', signInError)
        setError(signInError.message)
        setLoading(false)
        return
      }
      
      if (!data.user) {
        console.error('❌ No user returned')
        setError('Login failed - no user data')
        setLoading(false)
        return
      }

      console.log('✅ Login successful for:', data.user.email)

      // Check if super admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', data.user.id)
        .single()

      console.log('👤 User role:', profile?.role, '| Admin:', profile?.is_admin)

      // Small delay to ensure session is set
      await new Promise(resolve => setTimeout(resolve, 500))

      // Redirect based on role
      if (profile?.role === 'super_admin' || profile?.is_admin === true) {
        console.log('🔑 Redirecting to superadmin...')
        window.location.href = 'https://shopify.ezapps.app/superadmin'
      } else {
        console.log('👤 Redirecting to dashboard...')
        window.location.href = 'https://shopify.ezapps.app/dashboard'
      }
    } catch (err: any) {
      console.error('❌ Unexpected error:', err)
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none disabled:opacity-50"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
            >
              Sign up free
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Powerful apps for your Shopify store
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
              <img src="/Shopify.png" alt="Shopify" className="h-5" />
              <span>Shopify Apps</span>
            </div>
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
