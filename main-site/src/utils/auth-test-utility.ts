// Auth Test Utility
// Use this to test if authentication is working properly

import { createClient } from '@/lib/supabase/client'

export async function testAuthFlow(email: string, password: string) {
  const supabase = createClient()
  
  console.log('🧪 Testing auth flow for:', email)
  
  try {
    // Test 1: Sign in
    console.log('⏳ Step 1: Attempting sign in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message)
      return { success: false, error: signInError.message }
    }
    
    console.log('✅ Step 1: Sign in successful')
    console.log('👤 User:', signInData.user?.email)
    
    // Test 2: Get current session
    console.log('⏳ Step 2: Checking session...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError.message)
      return { success: false, error: sessionError.message }
    }
    
    console.log('✅ Step 2: Session valid')
    console.log('🔑 Session user:', sessionData.session?.user?.email)
    
    // Test 3: Check if user can access profile
    console.log('⏳ Step 3: Checking profile access...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', signInData.user.id)
      .single()
      
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows found, which is ok
      console.error('❌ Profile check failed:', profileError.message)
    } else {
      console.log('✅ Step 3: Profile access working')
      console.log('👑 Profile:', profile)
    }
    
    return {
      success: true,
      user: signInData.user,
      session: sessionData.session,
      profile
    }
    
  } catch (err: any) {
    console.error('❌ Unexpected error:', err.message)
    return { success: false, error: err.message }
  }
}

// Test the super admin bypass logic
export function testSuperAdminLogic(userEmail: string) {
  const isSuperAdminEmail = userEmail === 'sesarch@yahoo.com'
  
  console.log('🧪 Testing super admin logic for:', userEmail)
  console.log('🔒 Is super admin email:', isSuperAdminEmail)
  
  if (isSuperAdminEmail) {
    console.log('✅ Should redirect to: /superadmin')
    console.log('✅ Should bypass profile database check')
    return { shouldRedirectTo: '/superadmin', bypassDatabase: true }
  } else {
    console.log('✅ Should redirect to: /dashboard')
    console.log('✅ Should check profile in database')
    return { shouldRedirectTo: '/dashboard', bypassDatabase: false }
  }
}

// Quick test you can run in browser console
export async function quickTest() {
  console.log('🧪 Running quick authentication test...')
  
  // Test super admin logic
  testSuperAdminLogic('sesarch@yahoo.com')
  testSuperAdminLogic('test@example.com')
  
  // You would need to call testAuthFlow with real credentials
  console.log('📝 To test full auth flow, run: testAuthFlow("your-email", "your-password")')
  
  return 'Test utility loaded. Check console for details.'
}

// Export for easy browser console testing
if (typeof window !== 'undefined') {
  (window as any).authTest = {
    testAuthFlow,
    testSuperAdminLogic,
    quickTest
  }
}
