'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EmergencyLoginPage() {
  const [email, setEmail] = useState('sina@usa.com')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateLink = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to generate link')
      } else {
        setResult(data)
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Emergency Login</h2>
          <p className="mt-2 text-gray-600">
            Bypass rate limits using admin API
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Magic Link'}
            </button>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg text-sm">
                <p className="font-semibold mb-2">✅ Link Generated!</p>
                {result.actionLink ? (
                  <a 
                    href={result.actionLink}
                    className="text-blue-600 hover:underline break-all block"
                  >
                    Click here to login
                  </a>
                ) : (
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to normal login
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          This page uses admin privileges to bypass rate limits.
          <br />Remove this page after fixing the issue!
        </p>
      </div>
    </div>
  )
}
