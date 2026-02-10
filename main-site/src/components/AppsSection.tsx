'use client'

export default function AppsSection() {
  const apps = [
    { 
      id: 'inventory',
      name: 'Inventory Management', 
      icon: '📦', 
      gradient: 'from-blue-500 to-blue-600',
      description: 'Track stock, BOMs, parts, suppliers & purchase orders',
      status: 'Live'
    },
    { 
      id: 'loyalty',
      name: 'Loyalty Program', 
      icon: '🎁', 
      gradient: 'from-purple-500 to-purple-600',
      description: 'Reward customers with points, tiers & exclusive perks',
      status: 'Coming Soon'
    },
    { 
      id: 'reviews',
      name: 'Review Manager', 
      icon: '⭐', 
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Collect, manage & display customer reviews',
      status: 'Coming Soon'
    },
    { 
      id: 'upsell',
      name: 'Upsell Engine', 
      icon: '📈', 
      gradient: 'from-green-500 to-emerald-600',
      description: 'Boost revenue with smart product recommendations',
      status: 'Coming Soon'
    },
    { 
      id: 'email',
      name: 'Email & SMS Marketing', 
      icon: '📧', 
      gradient: 'from-pink-500 to-rose-600',
      description: 'Engage customers with automated campaigns',
      status: 'Coming Soon'
    },
    { 
      id: 'forms',
      name: 'EZ Form Builder', 
      icon: '📋', 
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Create custom forms for any purpose',
      status: 'Coming Soon'
    }
  ]

  return (
    <section id="apps" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Apps for Your Shopify Store
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Six essential tools to grow your business, manage inventory, engage customers, and boost sales
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app) => (
            <div
              key={app.id}
              className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {app.status === 'Live' ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    ✓ Live
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* App Icon */}
              <div className="flex justify-center mb-6">
                <div 
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {app.icon}
                </div>
              </div>

              {/* App Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {app.description}
                </p>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Start with Inventory Management, more apps launching soon
          </p>
          <a 
            href="/signup" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#96BF48] to-[#5E8E3E] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </section>
  )
}
