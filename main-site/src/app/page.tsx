import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      {/* The Navbar is now in layout.tsx, so we don't need it here.
         This cleans up the "stacked" look in your screenshot.
      */}
      <Hero />
      
      {/* Additional Corporate Section: Why Us? 
      */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Engineered for Reliability</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">One unified login. One consistent data source. Six powerful enterprise applications.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl mb-6 text-slate-900 font-black">01</div>
              <h3 className="font-bold text-xl mb-4 uppercase">SOC2 Secure</h3>
              <p className="text-slate-600">Enterprise-grade security protocols to protect your merchant and customer data.</p>
            </div>
            <div>
              <div className="text-4xl mb-6 text-slate-900 font-black">02</div>
              <h3 className="font-bold text-xl mb-4 uppercase">Real-Time Sync</h3>
              <p className="text-slate-600">Direct integration with Shopify APIs ensuring sub-second updates across all regions.</p>
            </div>
            <div>
              <div className="text-4xl mb-6 text-slate-900 font-black">03</div>
              <h3 className="font-bold text-xl mb-4 uppercase">24/7 Support</h3>
              <p className="text-slate-600">Dedicated account managers for our enterprise partners to ensure zero downtime.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
