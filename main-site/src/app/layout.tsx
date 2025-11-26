import './globals.css'
import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
})

export const metadata: Metadata = {
  title: 'EZ Apps - E-commerce Apps for Every Platform',
  description: 'Powerful apps for Shopify, WooCommerce, Wix, and more. Manage inventory, boost loyalty, and grow your store.',
  keywords: 'e-commerce apps, shopify apps, woocommerce, inventory management, loyalty program',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
