// 🎯 LOGOUT HANDLER - Production Only
// File: src/app/auth/signout/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Sign out
  await supabase.auth.signOut()
  
  // Redirect back to main domain (ezapps.app)
  return NextResponse.redirect('https://ezapps.app')
}
