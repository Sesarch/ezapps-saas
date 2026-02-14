'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const solutions = [
    { name: 'Inventory ERP', href: '/products/inventory' },
    { name: 'Loyalty CRM', href: '/products/loyalty' },
    { name: 'Social Reviews', href: '/products/reviews' },
    { name: 'Revenue Upsell', href: '/products/upsell' },
    { name: 'Growth Marketing', href: '/products/marketing' },
    { name: 'Data Intelligence', href: '/products/forms' }
  ]

  return (
    <footer className="bg-[#0f172a] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-4 mb-8">
              {/* Using your logo file */}
              <img src="/logo.png" alt="EZ APPS" className="h-8 w-auto object-contain brightness-0 invert" />
              <div className="h-4 w-[1px] bg-slate-700" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise</span>
            </Link>
            <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8">
              Mission-critical infrastructure for high-volume Shopify merchants. Unified commerce at a global scale.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                SOC2 Type II
              </div>
              <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                GDPR
              </div>
            </div>
          </div>

          {/* DYNAMIC SOLUTIONS COLUMN */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Platform Solutions</h4>
            <ul className="grid grid-cols-1 gap-4">
              {solutions.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES & COMPANY */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/case-studies" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Case Studies</Link></li>
              <li><Link href="/pricing" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Pricing</Link></li>
              <li><Link href="/contact" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-tight">Contact Sales</Link></li>
            </ul>
          </div>

          {/* PARTNERSHIP SIGNAL */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Partners</h4>
            <div className="flex flex-col gap-6">
              <img src="/Shopify.png" alt="Shopify Partner" className="h-10 w-auto object-contain grayscale brightness-200 opacity-50 hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose">
                Official Enterprise <br/> Solutions Partner
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            © {currentYear} EZ APPS ENTERPRISE SOLUTIONS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
