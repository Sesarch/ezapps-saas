import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'EZ Apps - E-commerce Apps for Shopify, WooCommerce, Wix & More',
    template: '%s | EZ Apps'
  },
  description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix, BigCommerce, SquareSpace, Magento & OpenCart. Inventory management, loyalty programs, review manager, upsell engine, 3D viewer & form builder. Start free trial today!',
  keywords: [
    'e-commerce apps',
    'Shopify apps',
    'WooCommerce plugins',
    'Wix apps',
    'BigCommerce apps',
    'SquareSpace apps',
    'Magento extensions',
    'OpenCart extensions',
    'inventory management',
    'loyalty program',
    'review manager',
    'upsell engine',
    '3D product viewer',
    'form builder',
    'e-commerce tools',
    'online store apps',
    'multi-platform e-commerce',
    'EZ Apps',
  ],
  authors: [{ name: 'EZ Apps' }],
  creator: 'EZ Apps',
  publisher: 'EZ Apps',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ezapps.app',
    siteName: 'EZ Apps',
    title: 'EZ Apps - E-commerce Apps for Every Platform',
    description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix, BigCommerce & more. Inventory management, loyalty programs, reviews, upsells & more. Start free!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EZ Apps - E-commerce Apps for Every Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZ Apps - E-commerce Apps for Every Platform',
    description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix & more. Start your free trial today!',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://ezapps.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
