'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllPlatforms, platforms, pricing } from '@/config/platforms'

type PlanType = 'single' | 'bundle'
type BillingCycle = 'monthly' | 'yearly'

function SignupForm() {
  const [step, setStep] = useState(1) // 1: Choose Plan, 2: Account Details
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('shopify')
  const [planType, setPlanType] = useState<PlanType>('single')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const allPlatforms = getAllPlatforms()
  const currentPlatform = platforms[selectedPlatform]

  // Calculate pricing
  const priceInfo = planType === 'bundle' 
    ? {
        total: billingCycle === 'yearly' ? pricing.allPlatformsBundle.yearly : pricing.allPlatformsBundle.monthly,
        perMonth: billingCycle === 'yearly' ? pricing.allPlatformsBundle.yearlyPerMonth : pricing.allPlatformsBundle.monthly,
        savings: pricing.allPlatformsBundle.savings
      }
    : {
        total: billingCycle === 'yearly' ? pricing.singlePlatform.yearly : pricing.singlePlatform.monthly,
        perMonth: billingCycle === 'yearly' ? pricing.singlePlatform.yearlyPerMonth : pricing.singlePlatform.monthly,
        savings: 0
      }

  // Check URL params
  useEffect(() => {
    const platformParam = searchParams.get('platform')
    if (platformParam && platforms[platformParam]) {
      setSelectedPlatform(platformParam)
    }
    const planParam = searchParams.get('plan')
    if (planParam === 'bundle') {
      setPlanType('bundle')
    }
  }, [searchParams])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Calculate trial end date (7 days from now)
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          company_name: companyName,
          selected_platform: selectedPlatform,
          plan_type: planType,
          billing_cycle: billingCycle
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?platform=${selectedPlatform}`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create subscription record with trial
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: data.user.id,
          status: 'trialing',
          platforms: planType === 'bundle' ? allPlatforms.map(p => p.id) : [selectedPlatform],
          is_bundle: planType === 'bundle',
          base_platform: selectedPlatform,
          trial_ends_at: trialEndsAt.toISOString(),
          current_period_start: new Date().toISOString(),
          current_period_end: trialEndsAt.toISOString()
        }])

      if (subError) {
        console.error('Error creating subscription:', subError)
      }

      setSuccess(true)
    }
    
    setLoading(false)
  }

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${currentPlatform?.colors.primary}20` }}
          >
            <svg className="w-8 h-8" style={{ color: currentPlatform?.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600 mb-4">We sent a confirmation link to <strong>{email}</strong></p>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-700 text-sm">
              🎉 Your <strong>7-day free trial</strong> starts when you verify your email!
            </p>
          </div>

          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-gray-900 mb-2">Your Plan:</p>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: currentPlatform?.colors.primary }}
              >
                {planType === 'bundle' ? '✨' : currentPlatform?.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {planType === 'bundle' ? 'All Platforms Bundle' : currentPlatform?.displayName}
                </p>
                <p className="text-xs text-gray-500">
                  ${priceInfo.perMonth}/mo after trial • {billingCycle === 'yearly' ? 'Billed yearly' : 'Billed monthly'}
                </p>
              </div>
            </div>
          </div>

          <Link 
            href="/login" 
            className="font-medium hover:underline"
            style={{ color: currentPlatform?.colors.primary }}
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo.png" alt="EZ Apps" className="h-10 mx-auto mb-4" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Start your free trial</h2>
          <p className="mt-2 text-gray-600">7 days free • No credit card required</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200'
            }`}>1</div>
            <span className="font-medium">Choose Plan</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200'
            }`}>2</div>
            <span className="font-medium">Create Account</span>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Choose Plan */
          <div className="space-y-8">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                  billingCycle === 'yearly' ? 'left-8' : 'left-1'
                }`}></span>
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Save 2 months!
                </span>
              )}
            </div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Single Platform */}
              <div 
                onClick={() => setPlanType('single')}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all ${
                  planType === 'single' 
                    ? 'ring-2 ring-teal-500 border-transparent' 
                    : 'border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Single Platform</h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    planType === 'single' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                  }`}>
                    {planType === 'single' && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingCycle === 'yearly' ? pricing.singlePlatform.yearlyPerMonth.toFixed(0) : pricing.singlePlatform.monthly}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-gray-500">Billed ${pricing.singlePlatform.yearly}/year</p>
                  )}
                </div>

                {/* Platform Selector */}
                {planType === 'single' && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Select Your Platform</label>
                    <div className="grid grid-cols-3 gap-2">
                      {allPlatforms.map((platform) => (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (platform.status === 'active') {
                              setSelectedPlatform(platform.id)
                            }
                          }}
                          disabled={platform.status === 'coming_soon'}
                          className={`p-2 rounded-lg text-center transition-all ${
                            selectedPlatform === platform.id
                              ? 'ring-2 ring-offset-1'
                              : platform.status === 'coming_soon'
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-100'
                          }`}
                          style={{ 
                            boxShadow: selectedPlatform === platform.id ? `0 0 0 2px ${platform.colors.primary}` : undefined,
                            backgroundColor: selectedPlatform === platform.id ? `${platform.colors.primary}15` : undefined
                          }}
                        >
                          <div 
                            className={`w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center text-white text-sm ${
                              platform.status === 'coming_soon' ? 'grayscale' : ''
                            }`}
                            style={{ backgroundColor: platform.colors.primary }}
                          >
                            {platform.icon}
                          </div>
                          <span className="text-[10px] font-medium text-gray-700 block">{platform.name}</span>
                          {platform.status === 'coming_soon' && (
                            <span className="text-[8px] text-gray-400">Soon</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> All 6 Apps
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Unlimited Products
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> 10,000 Orders/month
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Email Support
                  </li>
                </ul>
              </div>

              {/* All Platforms Bundle */}
              <div 
                onClick={() => setPlanType('bundle')}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all relative ${
                  planType === 'bundle' 
                    ? 'ring-2 ring-purple-500 border-transparent' 
                    : 'border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    BEST VALUE
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">All Platforms</h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    planType === 'bundle' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                  }`}>
                    {planType === 'bundle' && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingCycle === 'yearly' ? pricing.allPlatformsBundle.yearlyPerMonth.toFixed(0) : pricing.allPlatformsBundle.monthly}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-gray-500">Billed ${pricing.allPlatformsBundle.yearly}/year</p>
                  )}
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Save ${pricing.allPlatformsBundle.savings}/month!
                  </p>
                </div>

                {/* All Platform Icons */}
                <div className="mb-4 flex flex-wrap gap-1 justify-center">
                  {allPlatforms.map((platform) => (
                    <div 
                      key={platform.id}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${
                        platform.status === 'coming_soon' ? 'grayscale opacity-50' : ''
                      }`}
                      style={{ backgroundColor: platform.colors.primary }}
                      title={platform.displayName}
                    >
                      {platform.icon}
                    </div>
                  ))}
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> <strong>All 9 Platforms</strong>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> All 6 Apps
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> <strong>Unlimited Orders</strong>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> <strong>Priority Support</strong>
                  </li>
                </ul>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                className="px-12 py-3 rounded-xl font-semibold text-white transition-all"
                style={{ 
                  backgroundColor: planType === 'bundle' 
                    ? '#8B5CF6' 
                    : currentPlatform?.colors.primary || '#14B8A6'
                }}
              >
                Continue with {planType === 'bundle' ? 'All Platforms' : currentPlatform?.displayName}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                7-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        ) : (
          /* Step 2: Account Details */
          <div className="max-w-md mx-auto">
            {/* Selected Plan Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl"
                    style={{ 
                      backgroundColor: planType === 'bundle' 
                        ? '#8B5CF6' 
                        : currentPlatform?.colors.primary 
                    }}
                  >
                    {planType === 'bundle' ? '✨' : currentPlatform?.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {planType === 'bundle' ? 'All Platforms Bundle' : currentPlatform?.displayName}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${priceInfo.perMonth}/mo • {billingCycle === 'yearly' ? 'Billed yearly' : 'Billed monthly'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="text-teal-600 text-sm font-medium hover:underline"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Signup Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    placeholder="Min. 8 characters"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                  style={{ 
                    backgroundColor: planType === 'bundle' 
                      ? '#8B5CF6' 
                      : currentPlatform?.colors.primary || '#14B8A6'
                  }}
                >
                  {loading ? 'Creating account...' : 'Start Free Trial'}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-teal-600 hover:underline">Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
                </p>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
