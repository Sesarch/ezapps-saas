'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    // Dynamic import to prevent SSR issues
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()

      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.log('Auth timeout - setting loading to false')
        setLoading(false)
      }, 5000)

      // Get initial session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        console.log('Got session:', session ? 'yes' : 'no', 'Error:', error)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        clearTimeout(timeout)
      }).catch((err) => {
        console.error('Auth error:', err)
        setLoading(false)
        clearTimeout(timeout)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => {
        subscription.unsubscribe()
        clearTimeout(timeout)
      }
    })
  }, [])

  const signOut = async () => {
    if (typeof window === 'undefined') return

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    
    // Always redirect to main domain after logout
    const hostname = window.location.hostname
    const isProduction = !hostname.includes('localhost') && !hostname.includes('127.0.0.1')
    
    if (isProduction) {
      window.location.href = 'https://ezapps.app'
    } else {
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
