# EZ Apps - Multi-Platform E-commerce SaaS

A comprehensive SaaS platform providing essential apps for 7 major e-commerce platforms.

## 🏗️ Architecture

```
ezapps.app (Main Site)
├── Marketing pages
├── Pricing
├── Authentication
└── User Dashboard

shopify.ezapps.app (Shopify Apps)
├── Inventory Management
├── Loyalty Program
├── Review Manager
├── Upsell Engine
├── 3D Model Viewer
└── EZ Form Builder

woocommerce.ezapps.app (WooCommerce)
bigcommerce.ezapps.app (BigCommerce)
wix.ezapps.app (Wix)
squarespace.ezapps.app (SquareSpace)
magento.ezapps.app (Magento)
opencart.ezapps.app (OpenCart)
```

## 📦 Project Structure

```
ezapps-saas/
├── main-site/          # Main website (ezapps.app)
├── shopify-apps/       # Shopify platform apps
├── shared/             # Shared utilities, components
├── database/           # Database schemas and migrations
└── docs/               # Documentation
```

## 🚀 Tech Stack

### Main Site
- **Frontend**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL (Supabase)

### Shopify Apps
- **Backend**: Node.js + Express
- **Frontend**: React
- **Shopify Integration**: @shopify/shopify-api
- **Database**: PostgreSQL (Supabase)

## 🎯 Phase 1 - Current Sprint

✅ Main website structure
✅ Authentication system
✅ User dashboard
✅ Shopify OAuth integration
✅ Inventory Management app (MVP)

## 📝 Getting Started

Detailed setup instructions coming soon...

## 🔐 Environment Variables

See `.env.example` files in each subdirectory.

## 📖 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Shopify Integration](docs/SHOPIFY_INTEGRATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)

## 🤝 Contributing

This is a private project.

## 📄 License

Proprietary - All rights reserved 
