'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DashboardShell from '@/components/DashboardShell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.log('Auth check failed or no user found')
          router.push('/login')
          return
        }

        // We fetch the profile to ensure the user is active, 
        // but we STOP the forced external redirects to fix the loop.
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_admin')
          .eq('id', user.id)
          .single()
        
        setUser(user)
      } catch (err) {
        console.error('Error in DashboardLayout auth check:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-teal-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  // If user is missing, don't show the shell
  if (!user) return null

  return <DashboardShell user={user}>{children}</DashboardShell>
}
