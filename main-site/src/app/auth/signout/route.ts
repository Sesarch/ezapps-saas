import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = await createClient()
  
  // Sign out from Supabase
  await supabase.auth.signOut()
  
  // Clear all auth cookies
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  
  const response = NextResponse.redirect('https://ezapps.app')
  
  // Delete all Supabase auth cookies
  allCookies.forEach(cookie => {
    if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
      response.cookies.delete({
        name: cookie.name,
        domain: '.ezapps.app',
        path: '/',
      })
    }
  })
  
  return response
}

export async function POST() {
  return GET()
}
