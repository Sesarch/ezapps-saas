import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'EZ Apps - E-commerce Apps for Shopify, WooCommerce, Wix & More',
  description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix, BigCommerce, SquareSpace, Magento & OpenCart. Inventory management, loyalty programs, review manager, upsell engine. Start free trial today!',
  keywords: ['e-commerce apps', 'Shopify apps', 'WooCommerce plugins', 'Wix apps', 'inventory management', 'loyalty program', 'EZ Apps'],
  authors: [{ name: 'EZ Apps' }],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ezapps.app',
    siteName: 'EZ Apps',
    title: 'EZ Apps - E-commerce Apps for Every Platform',
    description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix & more. Start free!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EZ Apps',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZ Apps - E-commerce Apps for Every Platform',
    description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix & more.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
