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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            One Solution for All Platforms
          </h2>
          <p className="text-xl text-gray-600">
            Connect your store from any major e-commerce platform. One dashboard to manage them all.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6"
            >
              <div className="h-20 flex items-center justify-center mb-4">
                <img 
                  src={platform.logo} 
                  alt={platform.name}
                  className="max-h-16 w-auto object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {platform.name}
              </h3>

              <p className="text-cyan-500 font-medium text-center">
                {platform.users}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            More platforms coming soon.
          </p>
        </div>
      </div>
    </section>
  )
}
```

**Commit message:** `Fix Platforms component - use standard Tailwind classes`

---

## ✅ What I Fixed:

1. ❌ `text-turquoise` → ✅ `text-cyan-500` (standard Tailwind)
2. ❌ `group-hover:scale-110` → ✅ Removed (can cause issues)
3. ❌ `hover:-translate-y-1` → ✅ Removed (simpler)
4. ❌ `max-w-xs` → ✅ Removed (let grid handle sizing)
5. ❌ `justify-items-center` → ✅ Removed (not needed)
6. Simplified the whole component

---

## 🎨 Layout:
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Shopify  │  │   Woo    │  │   Wix    │
└──────────┘  └──────────┘  └──────────┘
┌──────────┐  ┌──────────┐  ┌──────────┐
│BigCommerce│ │SquareSpace│ │ Magento  │
└──────────┘  └──────────┘  └──────────┘
             ┌──────────┐
             │ OpenCart │
             └──────────┘
