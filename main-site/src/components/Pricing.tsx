'use client'

import Link from 'next/link'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 29,
      description: 'Perfect for trying out our apps',
      features: [
        '1 app of your choice',
        'All platform connections',
        'Email support',
        'Basic analytics',
        'Up to 1,000 orders/month',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Growth',
      price: 69,
      description: 'Best for growing businesses',
      features: [
        '3 apps of your choice',
        'All platform connections',
        'Priority support',
        'Advanced analytics',
        'Up to 10,000 orders/month',
        'Custom integrations',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 149,
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
      cta: 'Start Free Trial',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-ice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-navy mb-6">
            Choose the plan that fits your business. All plans include 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.popular
                  ? 'ring-2 ring-teal shadow-xl scale-105'
                  : 'border border-gray-200 shadow-sm'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-deepblue to-teal text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-dark mb-2">{plan.name}</h3>
              <p className="text-navy text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold text-dark">${plan.price}</span>
                <span className="text-navy">/month</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-navy">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href="/signup"
                className={`block w-full py-3 rounded-lg font-semibold text-center transition-all duration-200 ${
                  plan.popular
                    ? 'bg-teal text-white hover:bg-cyan shadow-lg'
                    : 'bg-ice text-deepblue hover:bg-lightcyan'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
