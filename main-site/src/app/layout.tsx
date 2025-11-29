import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EZ Apps - E-commerce Apps for Shopify, WooCommerce, Wix & More',
  description: 'Powerful e-commerce apps that work across all major platforms. Manage inventory, boost loyalty, collect reviews, and grow your online store.',
  keywords: ['e-commerce', 'shopify apps', 'woocommerce plugins', 'inventory management', 'loyalty program'],
  openGraph: {
    title: 'EZ Apps - E-commerce Apps for Every Platform',
    description: 'Powerful e-commerce apps that work across all major platforms.',
    url: 'https://ezapps.app',
    siteName: 'EZ Apps',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZ Apps - E-commerce Apps for Every Platform',
    description: 'Powerful e-commerce apps that work across all major platforms.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
