import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CaseStudyReport({ params }: Props) {
  const { slug } = await params;

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
      // RESTORED: Directly using your uploaded watch image
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7u6vY2nBv8N7v8N7v8N7v8N7v8N7v8.png'
    }
  }

  const report = content[slug] || content['global-fashion']

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/case-studies" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors mb-12 inline-block">
          ← Back to all cases
        </Link>
        
        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
          <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
        </div>

        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-6">
          {report.title}
        </h1>
        <p className="text-4xl font-black text-slate-500 mb-12 tracking-tighter uppercase">{report.metric}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-100 pt-12">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">The Challenge</h3>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">{report.challenge}</p>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">The Solution</h3>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">{report.solution}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
