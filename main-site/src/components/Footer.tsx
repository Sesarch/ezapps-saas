'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-4 mb-8">
              <img src="/logo.png" alt="EZ APPS" className="h-8 w-auto object-contain" />
              <div className="h-4 w-[1px] bg-slate-300" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise</span>
            </Link>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm">
              Mission-critical infrastructure for high-volume Shopify merchants. Unified commerce at a global scale.
            </p>
          </div>

          {/* LINKS COLUMNS */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Solutions</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-tight">
                <li><Link href="/products/inventory" className="hover:text-slate-900 transition-colors">Inventory ERP</Link></li>
                <li><Link href="/products/loyalty" className="hover:text-slate-900 transition-colors">Loyalty CRM</Link></li>
                <li><Link href="/products/marketing" className="hover:text-slate-900 transition-colors">Growth Marketing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-tight">
                <li><Link href="/case-studies" className="hover:text-slate-900 transition-colors">Case Studies</Link></li>
                <li><Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Sales</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Security</h4>
              <div className="flex flex-col gap-4">
                <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-black text-slate-400 w-fit uppercase">SOC2 Type II</span>
                <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-black text-slate-400 w-fit uppercase">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            © {currentYear} EZ APPS ENTERPRISE SOLUTIONS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
