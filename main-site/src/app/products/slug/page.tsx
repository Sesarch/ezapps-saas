import Link from 'next/link'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const products: any = {
    'inventory': { title: 'Inventory ERP', desc: 'Centralized warehouse management for global commerce.', icon: '📦' },
    'loyalty': { title: 'Loyalty CRM', desc: 'Automated retention and customer lifetime value tools.', icon: '🎁' },
    'reviews': { title: 'Social Reviews', icon: '⭐', desc: 'Enterprise-grade social proof and review aggregation.' },
    'upsell': { title: 'Revenue Upsell', icon: '📈', desc: 'AI-driven recommendation engines for high-volume stores.' },
    'marketing': { title: 'Growth Marketing', icon: '📧', desc: 'Multi-channel automation for Shopify Plus.' },
    'forms': { title: 'Data Intelligence', icon: '📝', desc: 'Custom data collection and customer insights.' }
  }

  const product = products[params.slug] || products['inventory']

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-6 border-b border-slate-100 flex justify-between items-center">
        <Link href="/" className="font-black text-2xl text-slate-900 uppercase">EZ APPS</Link>
        <Link href="/login" className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold">Sign In</Link>
      </nav>

      <main className="max-w-4xl mx-auto pt-20 px-6 text-center">
        <div className="text-8xl mb-8">{product.icon}</div>
        <h1 className="text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
          {product.title}
        </h1>
        <p className="text-2xl text-slate-500 mb-12 leading-relaxed">
          {product.desc}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className="font-bold text-xl mb-4 text-slate-900 uppercase">Enterprise Scale</h3>
            <p className="text-slate-600">Built for merchants handling 10,000+ orders per day with 99.9% reliability.</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className="font-bold text-xl mb-4 text-slate-900 uppercase">Seamless Sync</h3>
            <p className="text-slate-600">Native Shopify integration that keeps your data consistent across all 6 apps.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
