import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <img 
                src="/logo.png" 
                alt="EZ Apps" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 max-w-md">
              Powerful e-commerce apps that work across all major platforms. Manage inventory, boost loyalty, collect reviews, and grow your business.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-turquoise transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-turquoise transition-colors">Pricing</Link></li>
              <li><Link href="#platforms" className="text-gray-400 hover:text-turquoise transition-colors">Platforms</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-turquoise transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-turquoise transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-turquoise transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-turquoise transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 EZ Apps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
