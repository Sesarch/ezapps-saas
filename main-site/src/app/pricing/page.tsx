import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
          Simple. <span className="text-slate-500">Scalable.</span>
        </h1>
        <p className="text-2xl text-slate-500 max-w-2xl mx-auto mb-20 font-medium">
          One unified license for all 6 enterprise applications. No hidden fees.
        </p>

        <div className="max-w-md mx-auto bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-12 text-center">
            <span className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              Enterprise Suite
            </span>
            <div className="mt-8 flex items-baseline justify-center gap-1">
              <span className="text-6xl font-black text-slate-900">$499</span>
              <span className="text-slate-500 font-bold uppercase text-sm">/ month</span>
            </div>
            <p className="mt-4 text-slate-500 font-medium italic">Unlimited transactions & stores</p>
          </div>
          
          <div className="bg-slate-50 p-12 space-y-6 text-left">
            {[
              'All 6 Core Applications Included',
              'Real-Time Inventory Sync (ERP)',
              'Advanced CRM & Loyalty Logic',
              '99.9% Uptime SLA Guarantee',
              'Dedicated Account Manager',
              'Custom API Access'
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="h-2 w-2 bg-slate-900 rounded-full" />
                <span className="text-slate-700 font-bold uppercase text-xs tracking-wider">{feature}</span>
              </div>
            ))}
            
            <Link href="/signup" className="block w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl text-center font-black uppercase tracking-tighter text-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
