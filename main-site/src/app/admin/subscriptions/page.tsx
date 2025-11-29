'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('subscriptions')
        .select('*, profiles(email, full_name), plans(name, price_monthly)')
        .order('created_at', { ascending: false })
      
      setSubscriptions(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Subscriptions</h1>
        <p className="text-gray-400 mt-1">Monitor all customer subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold text-white">{subscriptions.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {subscriptions.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Trialing</p>
          <p className="text-2xl font-bold text-amber-400">
            {subscriptions.filter(s => s.status === 'trialing').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Canceled</p>
          <p className="text-2xl font-bold text-red-400">
            {subscriptions.filter(s => s.status === 'canceled').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{sub.profiles?.full_name || 'No name'}</p>
                      <p className="text-xs text-gray-400">{sub.profiles?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{sub.plans?.name}</p>
                      <p className="text-xs text-gray-400">${sub.plans?.price_monthly / 100}/mo</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sub.status === 'active' ? 'bg-green-600/20 text-green-400' :
                        sub.status === 'trialing' ? 'bg-amber-600/20 text-amber-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No subscriptions yet
          </div>
        )}
      </div>
    </div>
  )
}
