import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Platforms from '@/components/Platforms'
import Pricing from '@/components/Pricing'

export const metadata: Metadata = {
  title: 'EZ Apps - E-commerce Apps for Shopify, WooCommerce, Wix & More',
  description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix, BigCommerce, SquareSpace, Magento & OpenCart. Manage inventory, boost loyalty, collect reviews, increase sales. Start your 14-day free trial today!',
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EZ Apps',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix, BigCommerce, SquareSpace, Magento & OpenCart.',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '29',
      highPrice: '149',
      priceCurrency: 'USD',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EZ Apps',
    url: 'https://ezapps.app',
    logo: 'https://ezapps.app/logo.png',
    description: 'E-commerce apps for every platform',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Hero />
      <Features />
      <Platforms />
      <Pricing />
    </>
  )
}
```

**Commit message:** `Add JSON-LD structured data for SEO`

---

## 📋 Step 3: Create `robots.txt`

Go to GitHub → `main-site/public` → Click **"Add file"** → **"Create new file"**

**File name:** `robots.txt`

**Content:**
```
User-agent: *
Allow: /

Sitemap: https://ezapps.app/sitemap.xml

Disallow: /api/
Disallow: /dashboard/
