'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('plans')
        .select('*')
        .order('price_monthly', { ascending: true })
      
      setPlans(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-800 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Plans & Pricing</h1>
        <p className="text-gray-400 mt-1">Manage subscription plans</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                plan.is_active ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
              }`}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">${plan.price_monthly / 100}</span>
              <span className="text-gray-400">/mo</span>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Apps</span>
                <span className="text-white">{plan.apps_limit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Platforms</span>
                <span className="text-white">{plan.platforms_limit}</span>
              </div>
            </div>

            <button className="w-full py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
              Edit Plan
            </button>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8 bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
        <p className="text-amber-400 text-sm">
          💡 <strong>Note:</strong> To enable payments, you need to connect Stripe and add price IDs to each plan.
        </p>
      </div>
    </div>
  )
}
