import Link from 'next/link'

export default function Footer() {
  const sections = [
    {
      title: 'Platform',
      links: [
        { name: 'Inventory ERP', href: '/products/inventory' },
        { name: 'Loyalty CRM', href: '/products/loyalty' },
        { name: 'Social Reviews', href: '/products/reviews' },
        { name: 'Marketing Automation', href: '/products/marketing' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { name: 'For Shopify Plus', href: '#' },
        { name: 'Global Logistics', href: '#' },
        { name: 'Enterprise Scale', href: '#' },
        { name: 'B2B Wholesale', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Contact Sales', href: '#' },
        { name: 'Developer API', href: '#' }
      ]
    }
  ]

  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <span className="text-2xl font-black tracking-tighter uppercase">EZ APPS</span>
            <p className="mt-6 text-slate-400 max-w-sm leading-relaxed">
              Providing the mission-critical infrastructure for the world's fastest-growing Shopify merchants.
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-500">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-12 border-t border-slate-800 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">© 2026 EZ APPS ENTERPRISE SOLUTIONS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">GDPR</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
