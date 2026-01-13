'use client'

export default function Platforms() {
  const leftPlatforms = [
    { name: 'Wix', letter: 'W', gradient: 'from-[#0C6EFC] to-[#0052CC]' },
    { name: 'Squarespace', letter: 'S', gradient: 'from-[#222222] to-[#000000]' },
    { name: 'WooCommerce', letter: 'W', gradient: 'from-[#9B5C8F] to-[#7F54B3]' },
    { name: 'BigCommerce', letter: 'B', gradient: 'from-[#34313F] to-[#121118]' },
  ]

  const rightPlatforms = [
    { name: 'OpenCart', letter: 'O', gradient: 'from-[#2AC1E9] to-[#23A7CC]' },
    { name: 'Etsy', letter: 'E', gradient: 'from-[#F56400] to-[#D35400]' },
    { name: 'Amazon', letter: 'A', gradient: 'from-[#FF9900] to-[#E88B00]' },
    { name: 'Magento', letter: 'M', gradient: 'from-[#F26322] to-[#E85C1A]' },
  ]

  return (
    <section id="platforms" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Supported E-commerce Platforms
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Connect your store from any of these platforms
        </p>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-center gap-4">
          {/* Left Platforms */}
          <div className="flex gap-3">
            {leftPlatforms.map((platform) => (
              <div key={platform.name} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-white font-bold text-xl shadow-md mb-2`}>
                  {platform.letter}
                </div>
                <span className="text-xs font-semibold text-gray-700">{platform.name}</span>
              </div>
            ))}
          </div>

          {/* Center - Shopify */}
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white border-3 border-[#F5DF4D] shadow-xl relative mx-4">
            <span className="absolute -top-3 bg-[#F5DF4D] text-gray-900 text-xs font-bold px-3 py-1 rounded-full">★ MAIN</span>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#96BF48] to-[#5E8E3E] flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-3">
              S
            </div>
            <span className="text-base font-bold text-gray-900 mb-1">Shopify</span>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">✓ Active</span>
          </div>

          {/* Right Platforms */}
          <div className="flex gap-3">
            {rightPlatforms.map((platform) => (
              <div key={platform.name} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-white font-bold text-xl shadow-md mb-2`}>
                  {platform.letter}
                </div>
                <span className="text-xs font-semibold text-gray-700">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet/Mobile Layout - Shopify stays centered */}
        <div className="lg:hidden flex flex-col items-center gap-6">
          {/* Top Platforms */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {leftPlatforms.map((platform) => (
              <div key={platform.name} className="flex flex-col items-center p-3 rounded-xl bg-gray-50">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md mb-2`}>
                  {platform.letter}
                </div>
                <span className="text-xs font-semibold text-gray-700">{platform.name}</span>
              </div>
            ))}
          </div>

          {/* Center - Shopify */}
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white border-3 border-[#F5DF4D] shadow-xl relative">
            <span className="absolute -top-3 bg-[#F5DF4D] text-gray-900 text-xs font-bold px-3 py-1 rounded-full">★ MAIN</span>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#96BF48] to-[#5E8E3E] flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-2">
              S
            </div>
            <span className="text-base font-bold text-gray-900 mb-1">Shopify</span>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">✓ Active</span>
          </div>

          {/* Bottom Platforms */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {rightPlatforms.map((platform) => (
              <div key={platform.name} className="flex flex-col items-center p-3 rounded-xl bg-gray-50">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md mb-2`}>
                  {platform.letter}
                </div>
                <span className="text-xs font-semibold text-gray-700">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
