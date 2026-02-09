'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackContent() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setSessionAndRedirect = async () => {
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')

      if (!accessToken || !refreshToken) {
        window.location.href = 'https://ezapps.app/login'
        return
      }

      try {
        const supabase = createClient()

        // Set the session using the tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          console.error('Error setting session:', error)
          setError('Failed to authenticate. Redirecting to login...')
          setTimeout(() => {
            window.location.href = 'https://ezapps.app/login'
          }, 2000)
          return
        }

        if (!data.session) {
          setError('No session created. Redirecting to login...')
          setTimeout(() => {
            window.location.href = 'https://ezapps.app/login'
          }, 2000)
          return
        }

        // Session set successfully! Wait a moment for cookies to settle
        await new Promise(resolve => setTimeout(resolve, 500))

        // Use window.location for reliable redirect (not router.push)
        window.location.href = '/dashboard'
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An error occurred. Redirecting to login...')
        setTimeout(() => {
          window.location.href = 'https://ezapps.app/login'
        }, 2000)
      }
    }

    setSessionAndRedirect()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 mb-4 text-4xl">{'\u26A0\uFE0F'}</div>
            <p className="text-gray-900 font-medium">{error}</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up your session...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function CallbackSubdomain() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
