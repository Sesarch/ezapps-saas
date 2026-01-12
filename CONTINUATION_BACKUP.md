# EZ Apps SaaS - Project Continuation Backup
**Last Updated:** January 11, 2026
**Use this file to continue work in a new Claude chat**

---

## 🎯 Project Overview

**Project:** EZ Apps SaaS (ezapps.app)
**Description:** Multi-platform e-commerce tools for inventory management, BOM, orders, parts, suppliers, purchase orders, and build tracking.

### Supported Platforms (9 total):
1. ✅ **Shopify** - ACTIVE (OAuth working)
2. 🔜 WooCommerce - Coming Soon
3. 🔜 Wix - Coming Soon
4. 🔜 BigCommerce - Coming Soon
5. 🔜 Squarespace - Coming Soon
6. 🔜 Magento - Coming Soon
7. 🔜 OpenCart - Coming Soon
8. 🔜 Etsy - Coming Soon
9. 🔜 Amazon Seller - Coming Soon

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Hosting | Vercel |
| E-commerce | Shopify OAuth |

### Supabase Details:
- **Project ID:** skiimqutaftrcdtorqts
- **Organization:** sesearch@yahoo.com's Org

---

## 📁 Project Structure

```
ezapps-saas-main/
├── main-site/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx (Homepage)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx (Dashboard - UPDATED)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── stores/page.tsx (UPDATED)
│   │   │   │   ├── products/page.tsx
│   │   │   │   ├── parts/page.tsx
│   │   │   │   ├── suppliers/page.tsx
│   │   │   │   ├── bom/page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   ├── purchase-orders/page.tsx
│   │   │   │   ├── builds/page.tsx
│   │   │   │   ├── billing/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   ├── admin/
│   │   │   └── api/
│   │   │       └── auth/shopify/ (OAuth routes)
│   │   ├── components/
│   │   └── lib/supabase/
│   ├── package.json
│   └── tailwind.config.js
└── database/migrations/
```

---

## ✅ Bugs Fixed (This Session)

### 1. Store Disconnect Failed
**Problem:** Clicking "Disconnect" showed "Failed to disconnect store" error
**Cause:** Foreign key constraints + broken trigger + RLS policies
**Solution:**
- Dropped broken `recalculate_committed_trigger`
- Updated `disconnectStore` function to delete related records first
- Added proper RLS policy for delete

### 2. Dashboard Shows Wrong Data
**Problem:** Dashboard always showed 0 stores, 0 apps, hardcoded values
**Cause:** Values were hardcoded, not fetched from database
**Solution:** Updated `dashboard/page.tsx` to:
- Fetch stores from `stores` table
- Fetch apps from `apps` table
- Fetch subscription from `subscriptions` table
- Calculate trial days from profile creation date
- Show connected stores section when stores exist

### 3. Coming Soon Platforms Incomplete
**Problem:** Only showed 6 platforms, missing Etsy and Amazon Seller
**Cause:** Array only had 6 items
**Solution:** Updated `stores/page.tsx` to include all 8 coming soon platforms

---

## 🗄 Database Tables

### Key Tables:
- `profiles` - User profiles
- `stores` - Connected stores (has `store_url`, `user_id`, `platform_id`, `access_token`)
- `products` - Products synced from stores
- `parts` - Parts/components
- `suppliers` - Supplier information
- `orders` - Orders from stores
- `order_line_items` - Order line items (FK to orders, stores)
- `shopify_orders` - Shopify-specific orders
- `plans` - Subscription plans
- `subscriptions` - User subscriptions
- `apps` - Available apps
- `platforms` - Supported platforms

### RLS Policies Fixed:
- `stores` - Users can CRUD their own stores
- `plans` - Public read access
- `platforms` - Public read access
- `apps` - Public read access

### Triggers Removed:
- `recalculate_committed_trigger` on `order_line_items` (was broken)

---

## 🔧 Files Changed This Session

### 1. `main-site/src/app/dashboard/page.tsx`
- Added stores, subscription state
- Fetches real data from Supabase
- Shows connected stores when available
- Dynamic stats (not hardcoded)

### 2. `main-site/src/app/dashboard/stores/page.tsx`
- Fixed `disconnectStore` function
- Added all 8 coming soon platforms
- Uses `store_url` instead of `store_name`

---

## 🚀 Deployment

**Method:** GitHub → Vercel (auto-deploy)
**Live URL:** https://ezapps.app

To deploy changes:
1. Update files locally
2. `git add . && git commit -m "message" && git push`
3. Vercel auto-deploys

---

## 📋 Pending/Known Issues

1. **Trigger needs recreation** - `recalculate_committed_trigger` was dropped, may need to be recreated with fixed function if inventory committed quantity feature is needed

2. **Leaked Password Protection** - Supabase warning (requires custom SMTP)

3. **Function search_path warning** - `recalculate_committed` function needs `SET search_path = public`

---

## 🔐 Environment Variables Needed

```env
NEXT_PUBLIC_SUPABASE_URL=https://skiimqutaftrcdtorqts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=https://ezapps.app
SHOPIFY_CLIENT_ID=your_shopify_client_id
SHOPIFY_CLIENT_SECRET=your_shopify_client_secret
```

---

## 💬 How to Continue in New Chat

Copy and paste this to start a new chat:

```
I'm working on EZ Apps SaaS (ezapps.app) - a multi-platform e-commerce tool.

Tech Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase PostgreSQL
Supabase Project ID: skiimqutaftrcdtorqts

Current features:
- Dashboard with stats
- Shopify store connection (OAuth working)
- Products, Parts, Suppliers, BOM, Orders, Purchase Orders, Build Orders pages
- 9 platforms planned (Shopify active, 8 coming soon)

Recently fixed:
- Store disconnect function
- Dashboard showing real data instead of hardcoded values
- Added all 8 coming soon platforms (WooCommerce, Wix, BigCommerce, Squarespace, Magento, OpenCart, Etsy, Amazon Seller)

Please upload the ezapps-saas-main.zip file if you have it, or I can describe what I need help with.
```

---

## 📞 User Info

- **Email:** sina@usa.com
- **Account:** Free Trial (14 days)
- **Connected Store:** ezapps-2.myshopify.com

---

## 🎨 Brand Colors

- Primary Gray: #97999B
- Accent Yellow: #F5DF4D
- Success Green: #22C55E
- Background: White/Gray-50

---

**End of Backup Document**
