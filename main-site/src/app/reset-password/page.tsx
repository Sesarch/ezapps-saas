'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const router = useRouter()
  const hasRun = useRef(false)

  useEffect(() => {
    // Prevent double execution in React strict mode
    if (hasRun.current) return
    hasRun.current = true

    const supabase = createClient()

    // Handle the recovery flow
    const handleRecovery = async () => {
      try {
        const hash = window.location.hash
        const fullUrl = window.location.href
        
        console.log('Reset page loaded. URL:', fullUrl)
        console.log('Hash:', hash)
        
        // Check for hash params (Supabase sends tokens in URL hash)
        if (hash && hash.includes('access_token')) {
          const hashParams = new URLSearchParams(hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          const type = hashParams.get('type')
          
          console.log('Token type:', type)
          console.log('Has access token:', !!accessToken)
          console.log('Has refresh token:', !!refreshToken)
          
          if (accessToken && refreshToken) {
            // Set the session manually with the recovery tokens
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            
            if (sessionError) {
              console.error('Error setting session:', sessionError)
              setDebugInfo('Session error: ' + sessionError.message)
              setIsValidSession(false)
              return
            }
            
            if (data.session) {
              console.log('Session set successfully!')
              window.history.replaceState(null, '', window.location.pathname)
              setIsValidSession(true)
              return
            }
          }
        }
        
        // Check for query params (some Supabase versions use query params)
        const urlParams = new URLSearchParams(window.location.search)
        const queryToken = urlParams.get('access_token')
        const queryRefresh = urlParams.get('refresh_token')
        
        if (queryToken && queryRefresh) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: queryToken,
            refresh_token: queryRefresh,
          })
          
          if (!sessionError && data.session) {
            window.history.replaceState(null, '', window.location.pathname)
            setIsValidSession(true)
            return
          }
        }
        
        // No tokens in URL, check if we already have a session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          console.log('Existing session found')
          setIsValidSession(true)
        } else {
          console.log('No session found')
          setDebugInfo('No tokens found in URL and no existing session. Hash: ' + (hash ? hash.substring(0, 50) : 'empty'))
          setIsValidSession(false)
        }
      } catch (err: any) {
        console.error('Recovery error:', err)
        // Don't fail on AbortError - it's usually just React strict mode
        if (err?.name === 'AbortError') {
          console.log('AbortError caught, retrying...')
          // Wait a moment and check session
          setTimeout(async () => {
            const supabase2 = createClient()
            const { data: { session } } = await supabase2.auth.getSession()
            if (session) {
              setIsValidSession(true)
            } else {
              setDebugInfo('Request was cancelled. Please try clicking the reset link again.')
              setIsValidSession(false)
            }
          }, 500)
          return
        }
        setDebugInfo('Error: ' + String(err))
        setIsValidSession(false)
      }
    }

    handleRecovery()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Sign out to clear the recovery session, then redirect to login
    setTimeout(async () => {
      await supabase.auth.signOut()
      router.push('/login')
    }, 3000)
  }

  // Show loading while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  // Show error if no valid session/token
  if (isValidSession === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Invalid or Expired Link</h3>
            <p className="text-gray-600 mb-4">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            {debugInfo && (
              <p className="text-xs text-gray-400 mb-4 font-mono bg-gray-100 p-2 rounded break-all">
                Debug: {debugInfo}
              </p>
            )}
            <Link
              href="/forgot-password"
              className="inline-block py-3 px-6 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo.png" alt="EZ Apps" className="h-10 mx-auto mb-4" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Set New Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your new password below
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Updated!</h3>
              <p className="text-gray-600 mb-4">
                Your password has been successfully reset.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
