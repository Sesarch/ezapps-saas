import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function BillingPage() {
  const supabase = await createClient()
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  redirect('/login')
}  
  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get plans
  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard">
              <img src="/logo.png" alt="EZ Apps" className="h-8" />
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/billing" className="text-teal-600 text-sm font-medium">
                Billing
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <span className="text-gray-600 text-sm">{profile?.full_name || user.email}</span>
                <Link 
                  href="/auth/signout"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Plans</h1>
          <p className="text-gray-600 mt-1">Manage your subscription and billing</p>
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-teal-600">Free Trial</p>
              <p className="text-gray-600">14 days remaining</p>
            </div>
            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>

        {/* Plans */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans?.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-xl border-2 p-6 ${
                plan.id === 'growth' ? 'border-teal-500 shadow-lg' : 'border-gray-200'
              }`}
            >
              {plan.id === 'growth' && (
                <span className="inline-block px-2 py-1 bg-teal-500 text-white text-xs font-bold rounded mb-2">
                  POPULAR
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold">${plan.price_monthly / 100}</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>✓ {plan.apps_limit === 6 ? 'All 6' : plan.apps_limit} app{plan.apps_limit > 1 ? 's' : ''}</li>
                <li>✓ {plan.platforms_limit === 7 ? 'All 7' : plan.platforms_limit} platform{plan.platforms_limit > 1 ? 's' : ''}</li>
              </ul>
              <button 
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  plan.id === 'growth' 
                    ? 'bg-teal-500 text-white hover:bg-teal-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
          <p className="text-gray-600">No payment method added yet.</p>
          <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Add Payment Method
          </button>
        </div>
      </main>
    </div>
  )
}
