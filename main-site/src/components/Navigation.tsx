'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EZ</span>
            </div>
            <span className="text-2xl font-display font-bold text-gray-900">Apps</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="#platforms" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Platforms
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Docs
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="#platforms" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Platforms
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Docs
              </Link>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                <Link href="/login" className="btn-secondary text-center">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
