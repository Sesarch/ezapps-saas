'use client'

import { motion } from 'framer-motion'

export default function SuperAdminPage() {
  const stats = [
    { label: 'Total Revenue', value: '$12,450', grow: '+12%' },
    { label: 'Active Merchants', value: '184', grow: '+5%' },
    { label: 'Annual Plans', value: '42', grow: '+18%' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Master Control</span>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mt-2">Super Admin Panel</h1>
          <p className="text-slate-500 font-medium tracking-tight">System Management for sesarch@yahoo.com</p>
        </header>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="flex items-end gap-4">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                <span className="text-emerald-500 font-bold text-xs mb-1">{stat.grow}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN PANEL */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Active Merchant Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Email</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="group">
                    <td className="py-6 font-bold text-slate-900">merchant_store_0{i}@shopify.com</td>
                    <td className="py-6 text-xs font-bold text-slate-500 uppercase">Enterprise Bundle</td>
                    <td className="py-6">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">Active</span>
                    </td>
                    <td className="py-6 text-right">
                      <button className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Edit Access</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
