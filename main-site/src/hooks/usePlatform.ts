'use client'

import { useEffect, useState } from 'react'
import { platforms } from '@/config/platforms'

export function usePlatform() {
  const [platformId, setPlatformId] = useState<string>('shopify')

  useEffect(() => {
    // Get platform from subdomain
    const hostname = window.location.hostname
    const subdomain = hostname.split('.')[0]
    
    // Check if subdomain is a valid platform
    if (platforms[subdomain]) {
      setPlatformId(subdomain)
    }
  }, [])

  return {
    platformId,
    platform: platforms[platformId],
    isValidPlatform: !!platforms[platformId]
  }
}
