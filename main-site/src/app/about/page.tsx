import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - EZ Apps',
  description: 'Learn about EZ Apps - the team behind powerful e-commerce apps for Shopify, WooCommerce, Wix, and more.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About EZ Apps
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We build powerful tools that help e-commerce businesses grow across every platform.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              EZ Apps was founded with a simple mission: to make powerful e-commerce tools accessible to businesses of all sizes, regardless of which platform they use.
            </p>
            <p>
              We noticed that many store owners were struggling to find quality apps that worked across multiple platforms. They were forced to use different tools for their Shopify store versus their WooCommerce site, leading to fragmented data and inconsistent experiences.
            </p>
            <p>
              That's why we built EZ Apps – a unified suite of e-commerce applications that work seamlessly across Shopify, WooCommerce, Wix, BigCommerce, SquareSpace, Magento, and OpenCart.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <p className="text-xl text-gray-700 italic">
              "To empower e-commerce businesses with unified, powerful tools that drive growth – no matter which platform they choose."
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inventory Management</h3>
              <p className="text-gray-600">Track stock levels and manage inventory across all your stores in real-time.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loyalty Program</h3>
              <p className="text-gray-600">Reward your customers and build lasting relationships with points and perks.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Review Manager</h3>
              <p className="text-gray-600">Collect, manage, and showcase customer reviews to build trust.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Upsell Engine</h3>
              <p className="text-gray-600">Increase average order value with smart product recommendations.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3D Model Viewer</h3>
              <p className="text-gray-600">Let customers view products in stunning 3D before they buy.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Form Builder</h3>
              <p className="text-gray-600">Create custom forms for surveys, orders, and customer feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-teal-100 mb-8 text-lg">Join thousands of businesses already using EZ Apps.</p>
          <Link href="/signup" className="inline-block px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}
