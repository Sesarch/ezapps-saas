'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Platform, platforms, getPlatform } from '@/config/platforms'

interface PlatformContextType {
  currentPlatform: Platform | null
  userPlatforms: string[]
  isLoading: boolean
  hasPlatformAccess: (platformId: string) => boolean
  switchPlatform: (platformId: string) => void
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [currentPlatform, setCurrentPlatform] = useState<Platform | null>(null)
  const [userPlatforms, setUserPlatforms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Detect platform from subdomain
    const detectPlatform = () => {
      if (typeof window === 'undefined') return null
      
      const hostname = window.location.hostname
      
      // Check for localhost or main domain
      if (hostname === 'localhost' || hostname === 'ezapps.app' || hostname === 'www.ezapps.app') {
        return null // Main site, no specific platform
      }
      
      // Extract subdomain (e.g., "shopify" from "shopify.ezapps.app")
      const parts = hostname.split('.')
      if (parts.length >= 3) {
        const subdomain = parts[0]
        return getPlatform(subdomain)
      }
      
      // For localhost with port (e.g., localhost:3000)
      // Check URL params for testing: ?platform=shopify
      const urlParams = new URLSearchParams(window.location.search)
      const platformParam = urlParams.get('platform')
      if (platformParam) {
        return getPlatform(platformParam)
      }
      
      return null
    }

    const platform = detectPlatform()
    setCurrentPlatform(platform)
    
    // Apply theme colors if platform exists
    if (platform) {
      applyPlatformTheme(platform)
    }
    
    setIsLoading(false)
  }, [])

  // Apply CSS variables for platform theme
  const applyPlatformTheme = (platform: Platform) => {
    const root = document.documentElement
    root.style.setProperty('--platform-primary', platform.colors.primary)
    root.style.setProperty('--platform-primary-dark', platform.colors.primaryDark)
    root.style.setProperty('--platform-secondary', platform.colors.secondary)
    root.style.setProperty('--platform-bg-light', platform.colors.bgLight)
    root.style.setProperty('--platform-bg-dark', platform.colors.bgDark)
    root.style.setProperty('--platform-accent', platform.colors.accent)
  }

  // Check if user has access to a platform
  const hasPlatformAccess = (platformId: string): boolean => {
    // If user has bundle, they have access to all
    // Otherwise check if platform is in their list
    return userPlatforms.includes(platformId) || userPlatforms.includes('all')
  }

  // Switch to another platform
  const switchPlatform = (platformId: string) => {
    const platform = getPlatform(platformId)
    if (!platform) return
    
    // Check access first
    if (!hasPlatformAccess(platformId)) {
      // Redirect to add platform page
      window.location.href = `/add-platform?platform=${platformId}`
      return
    }
    
    // Redirect to platform subdomain
    const currentPath = window.location.pathname
    window.location.href = `https://${platform.subdomain}${currentPath}`
  }

  return (
    <PlatformContext.Provider value={{
      currentPlatform,
      userPlatforms,
      isLoading,
      hasPlatformAccess,
      switchPlatform
    }}>
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatform() {
  const context = useContext(PlatformContext)
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider')
  }
  return context
}

// Hook to get current theme colors
export function usePlatformTheme() {
  const { currentPlatform } = usePlatform()
  
  // Default theme (teal - main site)
  const defaultTheme = {
    primary: '#14B8A6',
    primaryDark: '#0D9488',
    secondary: '#0F766E',
    bgLight: '#F0FDFA',
    bgDark: '#1E293B',
    accent: '#14B8A6'
  }
  
  if (!currentPlatform) return defaultTheme
  
  return currentPlatform.colors
}
