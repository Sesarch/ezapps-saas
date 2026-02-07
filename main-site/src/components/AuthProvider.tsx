'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'super_admin'
  is_admin: boolean
  status: string
  company_name: string | null
}

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isSuperAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isSuperAdmin: false,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  // Helper to fetch user profile
  const fetchProfile = async (userId: string, supabase: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      return null
    }
  }

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    // Dynamic import to prevent SSR issues
    import('@/lib/supabase/client').then(async ({ createClient }) => {
      const supabase = createClient()

      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setLoading(false)
      }, 5000)

      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        setSession(session)
        setUser(session?.user ?? null)

        // Fetch profile if user exists
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id, supabase)
          setProfile(profileData)
        }

        setLoading(false)
        clearTimeout(timeout)
      } catch (err) {
        setLoading(false)
        clearTimeout(timeout)
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        // Fetch profile when user logs in
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id, supabase)
          setProfile(profileData)
        } else {
          setProfile(null)
        }

        setLoading(false)
      })

      return () => {
        subscription.unsubscribe()
        clearTimeout(timeout)
      }
    })
  }, [])

  /**
   * Enterprise-grade sign out implementation
   * Handles all edge cases and ensures clean logout across the application
   */
  const signOut = async () => {
    // Prevent multiple simultaneous logout attempts
    if (signingOut) return
    
    setSigningOut(true)

    try {
      // Only run in browser
      if (typeof window === 'undefined') return

      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      // Sign out from Supabase (clears all auth cookies and tokens)
      await supabase.auth.signOut()
      
      // Clear local state immediately
      setUser(null)
      setProfile(null)
      setSession(null)
      
      // Determine redirect URL based on environment
      const hostname = window.location.hostname
      const isProduction = !hostname.includes('localhost') && !hostname.includes('127.0.0.1')
      
      const redirectUrl = isProduction ? 'https://ezapps.app' : '/'
      
      // Force navigation and reload to clear all cached state
      // Using replace() instead of href to prevent back button navigation
      window.location.replace(redirectUrl)
      
    } catch (error) {
      // If logout fails, still redirect user to homepage
      // This ensures users aren't stuck in a broken state
      const hostname = window.location.hostname
      const isProduction = !hostname.includes('localhost') && !hostname.includes('127.0.0.1')
      
      window.location.replace(isProduction ? 'https://ezapps.app' : '/')
    } finally {
      setSigningOut(false)
    }
  }

  const isSuperAdmin = profile?.role === 'super_admin' || profile?.is_admin === true

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      session, 
      loading, 
      isSuperAdmin,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
