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
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient() // Create inside useEffect
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('https://ezapps.app/login')
        return
      }

      // Check if user is super admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single()
      
      if (!profile?.is_admin && profile?.role !== 'super_admin') {
        router.push('https://shopify.ezapps.app/dashboard')
        return
      }
      
      setUser(user)
      setIsAdmin(true)
      setLoading(false)
    }
    
    checkAuth()
  }, [router])

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
