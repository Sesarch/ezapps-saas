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

  // Helper to fetch user profile
  const fetchProfile = async (userId: string, supabase: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      console.log('✅ Profile loaded:', data.email, '| Role:', data.role, '| Admin:', data.is_admin)
      return data
    } catch (err) {
      console.error('Profile fetch error:', err)
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
        console.log('Auth timeout - setting loading to false')
        setLoading(false)
      }, 5000)

      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('Got session:', session ? 'yes' : 'no', 'Error:', error)
        
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
        console.error('Auth error:', err)
        setLoading(false)
        clearTimeout(timeout)
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        console.log('Auth state changed:', _event)
        
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

  const signOut = async () => {
    if (typeof window === 'undefined') return

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
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
