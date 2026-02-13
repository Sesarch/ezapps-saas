import Link from 'next/link'

export default function CaseStudiesPage() {
  const cases = [
    {
      company: 'Global Fashion Co.',
      result: '+340% Growth',
      desc: 'How switching to EZ Apps Inventory ERP solved their multi-warehouse syncing issues in 48 hours.',
      tag: 'Logistics'
    },
    {
      company: 'Luxury Watch Lab',
      result: '2.5x Retention',
      desc: 'A deep dive into the Loyalty CRM strategies that increased repeat purchases by 150%.',
      tag: 'CRM'
    }
  ]

  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
            Proven <span className="text-slate-500">Results.</span>
          </h1>
          <p className="text-2xl text-slate-500 max-w-2xl font-medium">
            Discover how high-volume Shopify merchants scale their infrastructure with EZ Apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {cases.map((c) => (
            <div key={c.company} className="group cursor-pointer">
              <div className="aspect-[16/9] bg-slate-100 rounded-[3rem] mb-8 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-slate-300 font-black text-4xl uppercase opacity-20 tracking-tighter">Enterprise Client</span>
                </div>
              </div>
              <div className="px-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{c.tag}</span>
                <h3 className="text-3xl font-black text-slate-900 mt-2 mb-4 uppercase tracking-tighter">{c.company}</h3>
                <p className="text-4xl font-black text-slate-900 mb-4">{c.result}</p>
                <p className="text-slate-500 text-lg leading-relaxed mb-6 font-medium">{c.desc}</p>
                <span className="text-slate-900 font-black uppercase text-xs tracking-widest group-hover:underline">Read Full Report →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
