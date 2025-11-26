'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-deepblue to-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EZ</span>
            </div>
            <span className="text-2xl font-bold text-dark">Apps</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-navy hover:text-teal transition-colors font-medium">
              Features
            </Link>
            <Link href="#platforms" className="text-navy hover:text-teal transition-colors font-medium">
              Platforms
            </Link>
            <Link href="#pricing" className="text-navy hover:text-teal transition-colors font-medium">
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-navy hover:text-teal transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/signup" className="px-6 py-2.5 bg-teal text-white rounded-lg font-medium hover:bg-cyan transition-all duration-200 shadow-md">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-navy hover:bg-ice transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="#features" className="text-navy hover:text-teal transition-colors font-medium">
                Features
              </Link>
              <Link href="#platforms" className="text-navy hover:text-teal transition-colors font-medium">
                Platforms
              </Link>
              <Link href="#pricing" className="text-navy hover:text-teal transition-colors font-medium">
                Pricing
              </Link>
              <hr className="border-gray-200" />
              <Link href="/login" className="text-navy hover:text-teal transition-colors font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="px-6 py-3 bg-teal text-white rounded-lg font-medium hover:bg-cyan transition-all duration-200 text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
