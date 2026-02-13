import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CaseStudyReport({ params }: Props) {
  const { slug } = await params;

  // We define the content map here. 
  // The 'image' key for luxury-watch MUST be a working URL.
  const content: Record<string, any> = {
    'global-fashion': {
      title: 'Global Fashion Co.',
      metric: '+340% Growth',
      challenge: 'Multi-warehouse inventory desync causing $50k/month in lost sales.',
      solution: 'Implemented EZ Apps Real-Time ERP for sub-second syncing across 14 locations.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'
    },
    'luxury-watch': {
      title: 'Luxury Watch Lab',
      metric: '2.5x Retention',
      challenge: 'High customer acquisition costs with low repeat purchase rates.',
      solution: 'Deployed EZ Apps Loyalty CRM with automated VIP tiering and personalized rewards.',
      // FIXED URL: This is a guaranteed high-res watch image
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop'
    }
  }

  const report = content[slug] || content['global-fashion']

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/case-studies" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors mb-12 inline-block">
          ← Back to all cases
        </Link>
        
        {/* THE IMAGE CONTAINER */}
        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl border border-slate-100 bg-slate-50">
          <img 
            src={report.image} 
            alt={report.title} 
            className="w-full h-full object-cover" 
            // Ensures that if the image fails, it doesn't just show white
            style={{ minHeight: '400px' }}
          />
        </div>

        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          {report.title}
        </h1>
        <p className="text-3xl font-black text-slate-400 mb-12 tracking-tighter uppercase leading-none">
            {report.metric}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-slate-100 pt-16">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 underline decoration-slate-200 underline-offset-8">The Challenge</h3>
            <p className="text-slate-500 text-xl leading-relaxed font-medium">{report.challenge}</p>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 underline decoration-slate-200 underline-offset-8">The Solution</h3>
            <p className="text-slate-500 text-xl leading-relaxed font-medium">{report.solution}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
