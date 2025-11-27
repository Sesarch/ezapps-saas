import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Platforms from '@/components/Platforms'
import Pricing from '@/components/Pricing'

export const metadata: Metadata = {
  title: 'EZ Apps - E-commerce Apps for Shopify, WooCommerce, Wix & More',
  description: 'Powerful e-commerce apps for Shopify, WooCommerce, Wix, BigCommerce, SquareSpace, Magento & OpenCart. Manage inventory, boost loyalty, collect reviews, increase sales. Start your 14-day free trial today!',
  alternates: {
    canonical: 'https://ezapps.app',
  },
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Platforms />
      <Pricing />
    </>
  )
}
```

**Commit message:** `Add SEO metadata to homepage`

---

## 📋 Step 3: Create `robots.txt`

Go to GitHub → `main-site/public` → **Add file** → **Create new file**

**File name:** `robots.txt`

**Content:**
```
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://ezapps.app/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /dashboard/
