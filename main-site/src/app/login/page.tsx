'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setDebugInfo('Starting login...')

    try {
      setDebugInfo('Creating Supabase client...')
      const supabase = createClient()
      
      setDebugInfo('Calling signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setDebugInfo('Login error: ' + error.message)
        setError(error.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setDebugInfo('No user returned')
        setError('Login failed')
        setLoading(false)
        return
      }

      setDebugInfo('Login successful! Checking profile...')

      // Check user role to determine where to redirect
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        setDebugInfo('Profile error: ' + profileError.message)
      }

      setDebugInfo('Profile loaded. Admin: ' + (profile?.is_admin || profile?.role === 'super_admin'))

      // If admin, go to superadmin
      if (profile?.is_admin || profile?.role === 'super_admin') {
        setDebugInfo('Redirecting to superadmin...')
        window.location.href = '/superadmin'
      } else {
        // Regular user, go to dashboard
        setDebugInfo('Redirecting to dashboard...')
        window.location.href = '/dashboard'
      }
      
    } catch (err: any) {
      setDebugInfo('Catch error: ' + err.message)
      setError('An error occurred')
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
              <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-bold">
                ⚠️ {error}
              </div>
            )}

            {debugInfo && (
              <div className="bg-blue-50 border-2 border-blue-500 text-blue-700 px-4 py-3 rounded-lg text-sm">
                🔍 {debugInfo}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-50"
                placeholder="your@email.com"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-50"
                placeholder="password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 disabled:opacity-50"
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
