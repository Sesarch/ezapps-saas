'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Check if we have a valid recovery token
    const checkToken = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          setError('Invalid or expired password reset link. Please request a new one.')
          setValidatingToken(false)
          return
        }
        
        setValidatingToken(false)
      } catch (err) {
        setError('Invalid or expired password reset link. Please request a new one.')
        setValidatingToken(false)
      }
    }

    checkToken()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading) return
    
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters')
      }

      // Password strength validation
      const hasUpperCase = /[A-Z]/.test(newPassword)
      const hasLowerCase = /[a-z]/.test(newPassword)
      const hasNumber = /[0-9]/.test(newPassword)
      
      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        throw new Error('Password must contain uppercase, lowercase, and number')
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccess(true)
      
      // Clear password fields
      setNewPassword('')
      setConfirmPassword('')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = 'https://ezapps.app/login'
      }, 3000)

    } catch (error: any) {
      let errorMessage = 'Failed to reset password'
      
      if (error.message.includes('match')) {
        errorMessage = 'Passwords do not match'
      } else if (error.message.includes('8 characters')) {
        errorMessage = 'Password must be at least 8 characters'
      } else if (error.message.includes('uppercase')) {
        errorMessage = 'Password must contain uppercase, lowercase, and number'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    )
  }

  if (error && !validatingToken && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/">
              <img src="/logo.png" alt="EZ Apps" className="h-10 mx-auto mb-4" />
            </Link>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Password reset links expire after a short time for security. Please request a new password reset link.
            </p>

            <Link
              href="/forgot-password"
              className="block w-full py-3 bg-teal-500 text-white rounded-xl font-semibold text-center hover:bg-teal-600 transition-colors"
            >
              Request New Reset Link
            </Link>

            <div className="mt-4 text-center">
              <Link href="/login" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/">
              <img src="/logo.png" alt="EZ Apps" className="h-10 mx-auto mb-4" />
            </Link>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </div>

            <p className="text-gray-600 text-sm mb-6 text-center">
              Redirecting to login page...
            </p>

            <Link
              href="/login"
              className="block w-full py-3 bg-teal-500 text-white rounded-xl font-semibold text-center hover:bg-teal-600 transition-colors"
            >
              Go to Login
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
          <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-gray-600">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleResetPassword} className="space-y-4">
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Min. 8 characters (uppercase, lowercase, number)"
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
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 font-medium mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className="flex items-center gap-2">
                  <span className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                    {newPassword.length >= 8 ? '✓' : '○'}
                  </span>
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
                    {/[A-Z]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
                    {/[a-z]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  One lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
                    {/[0-9]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  One number
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
