'use client'

import Link from 'next/link'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 29,
      apps: 1,
      description: 'Perfect for trying out our apps',
      features: [
        'Choose 1 app from our suite',
        'All platform connections',
        'Email support',
        'Basic analytics',
        'Up to 1,000 orders/month',
      ],
      popular: false,
      cta: 'Start Free Trial',
    },
    {
      name: 'Growth',
      price: 69,
      apps: 3,
      description: 'Best for growing businesses',
      features: [
        'Choose 3 apps from our suite',
        'All platform connections',
        'Priority support',
        'Advanced analytics',
        'Up to 10,000 orders/month',
        'Custom integrations',
      ],
      popular: true,
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: 149,
      apps: 6,
      description: 'Complete solution for scaling',
      features: [
        'All 6 apps included',
        'All platform connections',
        '24/7 dedicated support',
        'Enterprise analytics',
        'Unlimited orders',
        'Custom integrations',
        'White-label options',
        'API access',
      ],
      popular: false,
      cta: 'Start Free Trial',
    },
  ]

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Choose the plan that fits your business. All plans include 14-day free trial.
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">No credit card required</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative card p-8 flex flex-col animate-slide-up ${
                plan.popular ? 'ring-2 ring-primary-500 shadow-xl scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900 font-display">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-primary-600 font-semibold mt-2">
                  {plan.apps} {plan.apps === 1 ? 'App' : 'Apps'} Included
                </p>
              </div>

              {/* CTA Button */}
              <Link 
                href="/signup"
                className={`w-full py-3 rounded-lg font-semibold text-center transition-all duration-200 mb-6 ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features List */}
              <ul className="space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include access to all 7 platforms. Need a custom plan? 
            <a href="/contact" className="text-primary-600 font-semibold hover:underline ml-1">
              Contact sales
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
