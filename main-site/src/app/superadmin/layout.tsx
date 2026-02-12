'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SuperAdminShell from '@/components/SuperAdminShell'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No user, redirecting to login')
        router.push('/login')
        return
      }

      console.log('User found:', user.email)

      // Check if user is super admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single()
      
      console.log('Profile query result:', { profile, error })
      console.log('is_admin value:', profile?.is_admin)
      console.log('role value:', profile?.role)
      
      const adminCheck = profile?.is_admin || profile?.role === 'super_admin'
      console.log('Admin check result:', adminCheck)
      
      if (!adminCheck) {
        console.log('Not admin, redirecting to dashboard')
        setDebugInfo(`NOT ADMIN - is_admin: ${profile?.is_admin}, role: ${profile?.role}`)
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000) // Wait 3 seconds so you can see the message
        return
      }
      
      console.log('Admin confirmed, showing superadmin')
      setUser(user)
      setIsAdmin(true)
      setLoading(false)
    }
    
    checkAuth()
  }, [router])

  if (debugInfo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-red-600 text-white p-8 rounded-xl max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-4">ACCESS DENIED</h1>
          <p className="text-lg mb-4">{debugInfo}</p>
          <p className="text-sm">Redirecting to dashboard in 3 seconds...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <SuperAdminShell user={user}>{children}</SuperAdminShell>
}
