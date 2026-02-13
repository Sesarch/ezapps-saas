import Link from 'next/link'

// Next.js 15 requirement: params must be treated as a Promise
type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  // Await the params to resolve the dynamic slug
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
      {/* FIXED NAVBAR WITH NEW LOGO */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
          <Link href="/" className="flex items-center">
            {/* New EZ APPS Logo */}
            <img src="/logo.png" alt="EZ APPS" className="h-8 w-auto object-contain" />
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* PRODUCT CONTENT */}
      <main className="max-w-5xl mx-auto pt-40 pb-24 px-6">
        <div className="text-center mb-16">
          <div className="text-8xl mb-8 filter drop-shadow-sm">{product.icon}</div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
            {product.title}
          </h1>
          <p className="text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            {product.desc}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-hover hover:border-slate-300">
            <h3 className="font-black text-xl mb-4 text-slate-900 uppercase tracking-tight">Enterprise Infrastructure</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Engineered for merchants processing thousands of daily orders. Our system ensures sub-second latency and zero data-loss during peak traffic.
            </p>
          </div>
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-hover hover:border-slate-300">
            <h3 className="font-black text-xl mb-4 text-slate-900 uppercase tracking-tight">Seamless Integration</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Deep-level Shopify API hooks that synchronize your {product.title} data with every other app in the EZ APPS suite instantly.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/signup" className="inline-block px-12 py-6 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 uppercase tracking-tighter">
            Deploy {product.title}
          </Link>
        </div>
      </main>
    </div>
  )
}
