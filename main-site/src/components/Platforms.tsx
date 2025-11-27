'use client'

export default function Platforms() {
  const platforms = [
    { id: 'shopify', name: 'Shopify', logo: '/Shopify.png', users: '2M+ stores' },
    { id: 'woocommerce', name: 'WooCommerce', logo: '/wooCommerce.png', users: '4M+ stores' },
    { id: 'wix', name: 'Wix', logo: '/Wix.png', users: '200K+ stores' },
    { id: 'bigcommerce', name: 'BigCommerce', logo: '/BigCommerce.png', users: '60K+ stores' },
    { id: 'squarespace', name: 'SquareSpace', logo: '/squarespace.png', users: '800K+ stores' },
    { id: 'magento', name: 'Magento', logo: '/MagentoCommerce.png', users: '250K+ stores' },
    { id: 'opencart', name: 'OpenCart', logo: '/opencart.png', users: '350K+ stores' },
  ]

  return (
    <section id="platforms" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            One Solution for All Platforms
          </h2>
          <p className="text-xl text-gray-600">
            Connect your store from any major e-commerce platform. One dashboard to manage them all.
          </p>
        </div>

        {/* Platform Cards - 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 w-full max-w-xs hover:-translate-y-1"
            >
              {/* Platform Logo */}
              <div className="w-full h-24 flex items-center justify-center mb-4">
                <img 
                  src={platform.logo} 
                  alt={platform.name}
                  className="max-h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Platform Name */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {platform.name}
              </h3>

              {/* Users Count */}
              <p className="text-turquoise font-medium text-center">
                {platform.users}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            More platforms coming soon. <span className="text-turquoise font-medium">Request a platform →</span>
          </p>
        </div>
      </div>
    </section>
  )
}
```

**Commit message:** `Fix Platforms - 3 cards per row, centered`

---

## ✅ What I Changed:

1. **Container:** Changed from `max-w-7xl` to `max-w-6xl` for better centering
2. **Grid:** `lg:grid-cols-3` - 3 cards per row on large screens
3. **Card width:** `max-w-xs` - limits card width for consistent sizing
4. **Centering:** `justify-items-center` - centers cards in grid
5. **Spacing:** Better padding and gaps

---

## 🎨 New Layout:
```
Desktop (3 per row):
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Shopify │  │  Woo    │  │   Wix   │
└─────────┘  └─────────┘  └─────────┘
┌─────────┐  ┌─────────┐  ┌─────────┐
│BigComm  │  │ Square  │  │ Magento │
└─────────┘  └─────────┘  └─────────┘
         ┌─────────┐
         │OpenCart │
         └─────────┘

Tablet (2 per row)
Mobile (1 per row)
