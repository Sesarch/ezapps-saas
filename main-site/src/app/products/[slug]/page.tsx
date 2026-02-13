import Link from 'next/link'

// Next.js 15 requires params to be a Promise
type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  // Await the params before using them
  const { slug } = await params;

  const products: Record<string, { title: string; desc: string; icon: string }> = {
    'inventory': { title: 'Inventory ERP', desc: 'Centralized warehouse management for global commerce.', icon: '📦' },
    'loyalty': { title: 'Loyalty CRM', desc: 'Automated retention and customer lifetime value tools.', icon: '🎁' },
    'reviews': { title: 'Social Reviews', icon: '⭐', desc: 'Enterprise-grade social proof and review aggregation.' },
    'upsell': { title: 'Revenue Upsell', icon: '📈', desc: 'AI-driven recommendation engines for high-volume stores.' },
    'marketing': { title: 'Growth Marketing', icon: '📧', desc: 'Multi-channel automation for Shopify Plus.' },
    'forms': { title: 'Data Intelligence', icon: '📝', desc: 'Custom data collection and customer insights.' }
  }

  const product = products[slug] || products['inventory']

  return (
    <div className="min-h-screen bg-white">
      {/* Matching Enterprise Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <Link href="/" className="font-black text-2xl text-slate-900 tracking-tighter uppercase">EZ APPS</Link>
          <Link href="/login" className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest">Client Sign In</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-40 pb-20 px-6">
        <div className="text-center mb-16">
          <div className="text-8xl mb-8">{product.icon}</div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
            {product.title}
          </h1>
          <p className="text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {product.desc}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h3 className="font-black text-xl mb-4 text-slate-900 uppercase tracking-tight">Enterprise Scale</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Built for merchants handling 10,000+ orders per day with 99.9% reliability and real-time syncing across all Shopify regions.</p>
          </div>
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h3 className="font-black text-xl mb-4 text-slate-900 uppercase tracking-tight">Unified Data Flow</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Native Shopify integration that ensures your ERP and CRM data remains consistent across your entire marketing and logistics stack.</p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/signup" className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 uppercase tracking-tighter">
            Get Started with {product.title}
          </Link>
        </div>
      </main>
    </div>
  )
}
