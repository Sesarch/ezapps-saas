// 🎯 LOGOUT HANDLER - Production Only
// File: src/app/auth/signout/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  
  // Sign out
  await supabase.auth.signOut()
  
  // Redirect back to main domain (ezapps.app)
  return NextResponse.redirect('https://ezapps.app')
}


// ============================================
// ALTERNATIVE: Client-side logout component
// ============================================
// If you prefer handling logout in a client component:
// File: src/components/LogoutButton.tsx

/*
'use client'

import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const supabase = createClient()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    
    // Redirect to main domain
    window.location.href = 'https://ezapps.app'
  }
  
  return (
    <button 
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-900"
    >
      Sign Out
    </button>
  )
}
*/
