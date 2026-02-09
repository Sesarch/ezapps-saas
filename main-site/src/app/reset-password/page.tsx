'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

function ResetPasswordForm() {
  const searchParams = useSearchParams()

  const [supabase, setSupabase] = useState<any>(null)
  const [ready, setReady] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // ✅ Create Supabase client in browser
  useEffect(() => {
    setSupabase(createClient())
  }, [])

  // ✅ VERY IMPORTANT: exchange recovery code for session
  useEffect(() => {
    if (!supabase) return

    const code = searchParams.get('code')

    if (!code) {
      setError('Invalid or expired reset link')
      return
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setError('Reset link expired or already used')
        } else {
          setReady(true)
        }
      })
  }, [supabase, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !ready) return

    setError(null)
    setLoading(true)

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
      ) {
        throw new Error(
          'Password must be at least 8 characters and include uppercase, lowercase, and a number'
        )
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setSuccess(true)

      setTimeout(() => {
        window.location.href = 'https://shopify.ezapps.app/login'
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-2 text-center text-xl font-semibold">
          Set New Password
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success ? (
          <div className="rounded bg-green-50 p-4 text-center text-green-600">
            Password updated successfully. Redirecting…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!ready}
              className="w-full rounded border px-3 py-2"
            />

            <input
              type="password"
              placeholder="Confirm password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!ready}
              className="w-full rounded border px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full rounded bg-teal-500 py-2 text-white disabled:opacity-60"
            >
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <a
            href="https://shopify.ezapps.app/login"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back to login
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
