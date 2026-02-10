import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import AppsSection from '@/components/AppsSection'
import Pricing from '@/components/Pricing'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Features />
        <AppsSection />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}
