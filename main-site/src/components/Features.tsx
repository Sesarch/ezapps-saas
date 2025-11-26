'use client'

export default function Features() {
  const features = [
    {
      icon: '📦',
      title: 'Inventory Management',
      description: 'Track stock levels, manage multiple locations, and automate reordering with real-time sync across all your stores.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🎁',
      title: 'Loyalty Program',
      description: 'Reward customers with points, create VIP tiers, and boost repeat purchases with automated campaigns.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '⭐',
      title: 'Review Manager',
      description: 'Collect, display, and respond to customer reviews. Build trust with automated review requests.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '📈',
      title: 'Upsell Engine',
      description: 'Increase average order value with smart product recommendations and one-click upsells at checkout.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: '🎨',
      title: '3D Model Viewer',
      description: 'Showcase products in stunning 3D. Let customers interact with your products from every angle.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: '📝',
      title: 'EZ Form Builder',
      description: 'Create conditional logic forms, surveys, and quizzes. Collect customer data with smart forms.',
      color: 'from-yellow-500 to-orange-500',
    },
  ]

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Six Powerful Apps
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to run and grow your e-commerce business, available across all major platforms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group card p-8 hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Learn More Link */}
              <button className="mt-4 text-primary-600 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all duration-200">
                <span>Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
