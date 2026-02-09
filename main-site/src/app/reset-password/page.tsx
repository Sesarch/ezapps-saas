'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()

      // Listen for the PASSWORD_RECOVERY event from the hash fragment
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            setValidToken(true)
            setChecking(false)
          }
        }
      )

      // Also check if there is already a session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setValidToken(true)
        setChecking(false)
      }

      // If no session and no hash, wait a moment then show error
      const hash = window.location.hash
      if (!hash && !session) {
        setError('Invalid or expired reset link. Please request a new one.')
        setChecking(false)
      }

      // Timeout fallback
      setTimeout(() => {
        setChecking((prev) => {
          if (prev) {
            setError('Invalid or expired reset link. Please request a new one.')
            return false
          }
          return prev
        })
      }, 5000)

      return () => {
        subscription.unsubscribe()
      }
    }

    checkSession()
  }, [])

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(pwd)) return 'Password must include an uppercase letter'
    if (!/[a-z]/.test(pwd)) return 'Password must include a lowercase letter'
    if (!/[0-9]/.test(pwd)) return 'Password must include a number'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const validationError = validatePassword(password)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
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
                Your password has been successfully changed.
              </p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </div>
          ) : !validToken ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h3>
              <p className="text-gray-600 mb-6">
                This link has expired or is invalid. Please request a new password reset.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block py-3 px-6 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
              >
                Request New Reset Link
              </Link>
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
                />
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p className={password.length >= 8 ? 'text-green-600' : ''}>
                  {password.length >= 8 ? '\u2713' : '\u2022'} At least 8 characters
                </p>
                <p className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  {/[A-Z]/.test(password) ? '\u2713' : '\u2022'} One uppercase letter
                </p>
                <p className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                  {/[a-z]/.test(password) ? '\u2713' : '\u2022'} One lowercase letter
                </p>
                <p className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                  {/[0-9]/.test(password) ? '\u2713' : '\u2022'} One number
                </p>
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

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
