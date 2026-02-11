'use client'

export const dynamic = 'force-dynamic'

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
        
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          setError('Failed to authenticate')
          setTimeout(() => {
            window.location.href = 'https://ezapps.app/login'
          }, 2000)
          return
        }

        if (!data.session) {
          setError('No session created')
          setTimeout(() => {
            window.location.href = 'https://ezapps.app/login'
          }, 2000)
          return
        }

        await new Promise(resolve => setTimeout(resolve, 500))
        
        window.location.href = 'https://shopify.ezapps.app/dashboard'
      } catch (err) {
        setError('An error occurred')
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
            <div className="text-red-500 mb-4 text-4xl">⚠️</div>
            <p className="text-gray-900 font-medium">{error}</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up your session...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function CallbackSubdomain() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
