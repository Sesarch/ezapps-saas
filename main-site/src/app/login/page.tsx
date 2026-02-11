'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const router = useRouter()

  const addDebug = (msg: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDebugInfo([])
    setLoading(true)

    addDebug('Starting login...')
    
    const supabase = createClient()
    addDebug('Supabase client created')

    try {
      addDebug(`Attempting sign in for: ${email}`)
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        addDebug(`ERROR: ${signInError.message}`)
        setError(`Login failed: ${signInError.message}`)
        setLoading(false)
        return
      }
      
      if (!data.user) {
        addDebug('ERROR: No user returned')
        setError('No user data received')
        setLoading(false)
        return
      }

      addDebug(`Success! User ID: ${data.user.id}`)
      addDebug('Using window.location.replace...')

      // Use replace instead of href - forces navigation
      window.location.replace('https://shopify.ezapps.app/dashboard')
      
    } catch (err: any) {
      addDebug(`EXCEPTION: ${err.message}`)
      setError(`Exception: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Login</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-bold">
                ⚠️ {error}
              </div>
            )}

            {debugInfo.length > 0 && (
              <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg text-xs font-mono max-h-40 overflow-y-auto">
                {debugInfo.map((msg, i) => (
                  <div key={i}>{msg}</div>
                ))}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
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

          <div className="mt-4 text-xs text-gray-500 text-center">
            Debug mode - watch for messages above
          </div>
        </div>
      </div>
    </div>
  )
}
