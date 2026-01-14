// Platform configuration for EZ Apps Multi-Platform SaaS
// Each platform has its own theme, colors, and settings

export interface Platform {
  id: string
  name: string
  displayName: string
  subdomain: string
  status: 'active' | 'coming_soon' | 'beta'
  colors: {
    primary: string
    primaryDark: string
    secondary: string
    gradient: string
    bgLight: string
    bgDark: string
    accent: string
  }
  icon: string
  description: string
}

export const platforms: Record<string, Platform> = {
  shopify: {
    id: 'shopify',
    name: 'Shopify',
    displayName: 'Shopify',
    subdomain: 'shopify.ezapps.app',
    status: 'active',
    colors: {
      primary: '#96BF48',
      primaryDark: '#5E8E3E',
      secondary: '#004C3F',
      gradient: 'from-[#96BF48] to-[#5E8E3E]',
      bgLight: '#F4FBF0',
      bgDark: '#1A2E1A',
      accent: '#96BF48'
    },
    icon: '🛍️',
    description: 'Connect your Shopify store'
  },
  woocommerce: {
    id: 'woocommerce',
    name: 'WooCommerce',
    displayName: 'WooCommerce',
    subdomain: 'woocommerce.ezapps.app',
    status: 'coming_soon',
    colors: {
      primary: '#7F54B3',
      primaryDark: '#9B5C8F',
      secondary: '#3C2A4D',
      gradient: 'from-[#7F54B3] to-[#9B5C8F]',
      bgLight: '#F9F5FC',
      bgDark: '#1E1A24',
      accent: '#7F54B3'
    },
    icon: '🔌',
    description: 'Connect your WooCommerce store'
  },
  wix: {
    id: 'wix',
    name: 'Wix',
    displayName: 'Wix',
    subdomain: 'wix.ezapps.app',
    status: 'coming_soon',
    colors: {
      primary: '#0C6EFC',
      primaryDark: '#0052CC',
      secondary: '#003087',
      gradient: 'from-[#0C6EFC] to-[#0052CC]',
      bgLight: '#F0F7FF',
      bgDark: '#0D1B2A',
      accent: '#0C6EFC'
    },
    icon: '🌐',
    description: 'Connect your Wix store'
  },
  bigcommerce: {
    id: 'bigcommerce',
    name: 'BigCommerce',
    displayName: 'BigCommerce',
    subdomain: 'bigcommerce.ezapps.app',
    status: 'coming_soon',
    colors: {
      primary: '#34313F',
      primaryDark: '#121118',
      secondary: '#5C5768',
      gradient: 'from-[#34313F] to-[#121118]',
      bgLight: '#F5F5F7',
      bgDark: '#121118',
      accent: '#6B5CE7'
    },
    icon: '🏪',
    description: 'Connect your BigCommerce store'
  },
  squarespace: {
    id: 'squarespace',
    name: 'Squarespace',
    displayName: 'Squarespace',
    subdomain: 'squarespace.ezapps.app',
    status: 'coming_soon',
    colors: {
      primary: '#222222',
      primaryDark: '#000000',
      secondary: '#444444',
      gradient: 'from-[#222222] to-[#000000]',
      bgLight: '#FAFAFA',
      bgDark: '#111111',
      accent: '#222222'
    },
    icon: '⬛',
    description: 'Connect your Squarespace store'
  },
  magento: {
    id: 'magento',
    name: 'Magento',
    displayName: 'Magento',
    subdomain: 'magento.ezapps.app',
    status: 'coming_soon',
    colors: {
      primary: '#F26322',
      primaryDark: '#E85C1A',
      secondary: '#EB5202',
      gradient: 'from-[#F26322] to-[#E85C1A]',
      bgLight: '#FFF8F5',
      bgDark: '#2A1810',
      accent: '#F26322'
    },
    icon: '🔶',
    description: 'Connect your Magento store'
  },
  opencart: {
    id: 'opencart',
    name: 'OpenCart',
    displayName: 'OpenCart',
    subdomain: 'opencart.ezapps.app',
    status: 'coming_soon',
    colors: {
      primary: '#2AC1E9',
      primaryDark: '#23A7CC',
      secondary: '#1B8FB3',
      gradient: 'from-[#2AC1E9] to-[#23A7CC]',
      bgLight: '#F0FBFE',
      bgDark: '#0D2129',
      accent: '#2AC1E9'
    },
    icon: '🛒',
    description: 'Connect your OpenCart store'
  },
  etsy: {
    id: 'etsy',
    name: 'Etsy',
    displayName: 'Etsy',
    subdomain: 'etsy.ezapps.app',
    status: 'coming_soon',
    colors: {
      primary: '#F56400',
      primaryDark: '#D35400',
      secondary: '#CF4A00',
      gradient: 'from-[#F56400] to-[#D35400]',
      bgLight: '#FFF9F5',
      bgDark: '#2A1A0D',
      accent: '#F56400'
    },
    icon: '🎨',
    description: 'Connect your Etsy shop'
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon',
    displayName: 'Amazon Seller',
    subdomain: 'amazon.ezapps.app',
    status: 'coming_soon',
    colors: {
      primary: '#FF9900',
      primaryDark: '#E88B00',
      secondary: '#146EB4',
      gradient: 'from-[#FF9900] to-[#E88B00]',
      bgLight: '#FFFBF5',
      bgDark: '#2A2010',
      accent: '#FF9900'
    },
    icon: '📦',
    description: 'Connect your Amazon Seller account'
  }
}

// Get platform by ID
export const getPlatform = (id: string): Platform | null => {
  return platforms[id] || null
}

// Get all platforms as array
export const getAllPlatforms = (): Platform[] => {
  return Object.values(platforms).sort((a, b) => {
    // Active platforms first, then by name
    if (a.status === 'active' && b.status !== 'active') return -1
    if (b.status === 'active' && a.status !== 'active') return 1
    return a.name.localeCompare(b.name)
  })
}

// Get active platforms only
export const getActivePlatforms = (): Platform[] => {
  return getAllPlatforms().filter(p => p.status === 'active')
}

// Get platform from subdomain
export const getPlatformFromSubdomain = (hostname: string): Platform | null => {
  const subdomain = hostname.split('.')[0]
  return platforms[subdomain] || null
}

// Check if platform is available for signup
export const isPlatformAvailable = (id: string): boolean => {
  const platform = platforms[id]
  return platform?.status === 'active'
}

// Pricing configuration
export const pricing = {
  singlePlatform: {
    monthly: 69,
    yearly: 690, // 2 months free
    yearlyPerMonth: 57.5
  },
  additionalPlatform: {
    monthly: 59,
    yearly: 590, // 2 months free
    yearlyPerMonth: 49.17
  },
  allPlatformsBundle: {
    monthly: 299,
    yearly: 2990, // 2 months free
    yearlyPerMonth: 249.17,
    savings: 242 // Monthly savings vs buying separately
  },
  trial: {
    days: 7
  }
}

// Calculate price based on selected platforms
export const calculatePrice = (
  platformCount: number, 
  isBundle: boolean, 
  isYearly: boolean
): { total: number; perMonth: number; savings: number } => {
  if (isBundle) {
    const price = isYearly ? pricing.allPlatformsBundle.yearly : pricing.allPlatformsBundle.monthly
    const perMonth = isYearly ? pricing.allPlatformsBundle.yearlyPerMonth : pricing.allPlatformsBundle.monthly
    // Calculate savings vs buying all separately
    const separatePrice = pricing.singlePlatform.monthly + (8 * pricing.additionalPlatform.monthly)
    const savings = separatePrice - pricing.allPlatformsBundle.monthly
    return { total: price, perMonth, savings }
  }
  
  if (platformCount === 0) return { total: 0, perMonth: 0, savings: 0 }
  
  const firstPlatform = isYearly ? pricing.singlePlatform.yearly : pricing.singlePlatform.monthly
  const additionalPlatforms = (platformCount - 1) * (isYearly ? pricing.additionalPlatform.yearly : pricing.additionalPlatform.monthly)
  const total = firstPlatform + additionalPlatforms
  const perMonth = isYearly ? total / 12 : total
  
  return { total, perMonth, savings: 0 }
}

// Apps available on all platforms
export const apps = [
  { id: 'inventory', name: 'Inventory Management', icon: '📦', description: 'Track stock levels and manage inventory' },
  { id: 'loyalty', name: 'Loyalty Program', icon: '🎁', description: 'Reward customers with points and tiers' },
  { id: 'reviews', name: 'Review Manager', icon: '⭐', description: 'Collect and display customer reviews' },
  { id: 'upsell', name: 'Upsell Engine', icon: '📈', description: 'Increase average order value' },
  { id: '3dviewer', name: '3D Model Viewer', icon: '🎨', description: 'Display products in 3D' },
  { id: 'forms', name: 'EZ Form Builder', icon: '📝', description: 'Create custom forms' }
]
