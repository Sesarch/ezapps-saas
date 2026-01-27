'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'

export default function GenerateLinkPage() {
  const [email, setEmail] = useState('sina@usa.com')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateLink = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else if (data.action_link) {
        setResult(data.action_link)
      } else {
        setError('No link generated')
      }
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-teal-600 mb-2">🔐 Generate Login Link</h1>
        <p className="text-gray-600 mb-6">Bypass rate limits with admin magic link</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <select
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value="sina@usa.com">sina@usa.com</option>
            <option value="test@test.com">test@test.com</option>
          </select>
        </div>

        <button
          onClick={generateLink}
          disabled={loading}
          className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Login Link'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl">
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl">
            <p className="text-green-700 font-medium mb-2">✅ Link Generated!</p>
            <a
              href={result}
              className="text-teal-600 hover:text-teal-700 underline break-all text-sm"
            >
              {result}
            </a>
            <button
              onClick={() => window.location.href = result}
              className="w-full mt-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
            >
              🚀 Click Here to Login
            </button>
          </div>
        )}

        <p className="mt-6 text-xs text-gray-400 text-center">
          ⚠️ Remove this page after use for security
        </p>
      </div>
    </div>
  )
}
