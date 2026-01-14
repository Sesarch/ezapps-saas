'use client'

import { useState, useRef, useEffect } from 'react'
import { getAllPlatforms, Platform, platforms } from '@/config/platforms'

interface PlatformSwitcherProps {
  currentPlatformId: string
  userPlatforms: string[] // Platforms user has access to
  isBundle?: boolean // User has all-platforms bundle
  onSwitch?: (platformId: string) => void
}

export default function PlatformSwitcher({ 
  currentPlatformId, 
  userPlatforms = ['shopify'],
  isBundle = false,
  onSwitch
}: PlatformSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const allPlatforms = getAllPlatforms()
  const currentPlatform = platforms[currentPlatformId]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasAccess = (platformId: string) => {
    if (isBundle) return true
    return userPlatforms.includes(platformId)
  }

  const handleSelect = (platform: Platform) => {
    if (platform.id === currentPlatformId) {
      setIsOpen(false)
      return
    }

    if (platform.status === 'coming_soon') {
      // Show coming soon message or do nothing
      return
    }

    if (!hasAccess(platform.id)) {
      // Redirect to add platform page
      window.location.href = `/add-platform?platform=${platform.id}`
      return
    }

    // Switch to platform
    if (onSwitch) {
      onSwitch(platform.id)
    } else {
      // Default: redirect to platform subdomain
      // window.location.href = `https://${platform.subdomain}/dashboard`
      // For development, use query param
      window.location.href = `/dashboard?platform=${platform.id}`
    }
    
    setIsOpen(false)
  }

  if (!currentPlatform) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Platform Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: currentPlatform.colors.primary }}
        >
          {currentPlatform.icon}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-gray-900">{currentPlatform.displayName}</p>
          <p className="text-xs text-gray-500">Current Platform</p>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 font-medium uppercase">Switch Platform</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto p-2">
            {allPlatforms.map((platform) => {
              const isActive = platform.id === currentPlatformId
              const hasAccessToPlatform = hasAccess(platform.id)
              const isComingSoon = platform.status === 'coming_soon'

              return (
                <button
                  key={platform.id}
                  onClick={() => handleSelect(platform)}
                  disabled={isComingSoon}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-gray-100' 
                      : isComingSoon
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Platform Icon */}
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg ${
                      isComingSoon ? 'grayscale' : ''
                    }`}
                    style={{ backgroundColor: platform.colors.primary }}
                  >
                    {platform.icon}
                  </div>

                  {/* Platform Info */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      {platform.displayName}
                      {isActive && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isComingSoon 
                        ? '🕐 Coming Soon' 
                        : hasAccessToPlatform 
                          ? '✅ Active'
                          : '🔒 Not subscribed'
                      }
                    </p>
                  </div>

                  {/* Action Badge */}
                  {!isActive && !isComingSoon && !hasAccessToPlatform && (
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
                      + Add
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Upgrade Banner */}
          {!isBundle && (
            <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <a 
                href="/dashboard/billing?upgrade=bundle"
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-lg">✨</span>
                <div>
                  <p className="font-medium text-gray-900">Get All Platforms</p>
                  <p className="text-xs text-gray-500">Save $242/month with the bundle</p>
                </div>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
