'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AppsPage() {
  const [apps, setApps] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('apps')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => setApps(data || []))
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Apps</h1>
        <p className="text-gray-600 mt-1">Browse and manage your e-commerce apps</p>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{app.icon}</div>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{app.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{app.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Included in all plans</span>
              <button 
                disabled
                className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Apps Coming Soon!</h3>
            <p className="text-gray-600 text-sm">
              We're working hard to bring you powerful e-commerce apps. Connect your store now to be the first to know when they're ready!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
