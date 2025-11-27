'use client'

export default function Features() {
  const features = [
    {
      icon: '📦',
      title: 'Inventory Management',
      description: 'Track stock levels, manage multiple locations, and automate reordering with real-time sync across all platforms.',
      gradient: 'from-turquoise to-turquoise-dark',
    },
    {
      icon: '🎁',
      title: 'Loyalty Program',
      description: 'Reward customers with points, create VIP tiers, and run automated campaigns to boost repeat purchases.',
      gradient: 'from-peach to-peach-dark',
    },
    {
      icon: '⭐',
      title: 'Review Manager',
      description: 'Collect, display, and respond to customer reviews. Automate review requests and boost social proof.',
      gradient: 'from-gold to-gold-dark',
    },
    {
      icon: '📈',
      title: 'Upsell Engine',
      description: 'Increase average order value with smart product recommendations, bundles, and checkout upsells.',
      gradient: 'from-turquoise-dark to-turquoise',
    },
    {
      icon: '🎨',
      title: '3D Model Viewer',
      description: 'Showcase products in stunning 3D. Let customers interact and view from every angle before buying.',
      gradient: 'from-peach-dark to-peach',
    },
    {
      icon: '📝',
      title: 'EZ Form Builder',
      description: 'Create powerful forms with conditional logic. Perfect for surveys, quizzes, and custom order forms.',
      gradient: 'from-gold-dark to-gold',
    },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Six Powerful Apps
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to run and grow your e-commerce business, available across all major platforms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-8 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
