import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - EZ Apps',
  description: 'EZ Apps Terms of Service - Read our terms and conditions for using our e-commerce applications.',
}

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: November 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using EZ Apps services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
              <p>
                EZ Apps provides e-commerce applications and tools including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Inventory Management</li>
                <li>Loyalty Program</li>
                <li>Review Manager</li>
                <li>Upsell Engine</li>
                <li>3D Model Viewer</li>
                <li>Form Builder</li>
              </ul>
              <p className="mt-4">
                These services are available for various e-commerce platforms including Shopify, WooCommerce, Wix, BigCommerce, SquareSpace, Magento, and OpenCart.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
              <p>To use our services, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payments</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Pricing</h3>
              <p>Our services are offered under the following plans:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Starter:</strong> $15/month - 1 app, 1 platform</li>
                <li><strong>Growth:</strong> $39/month - 3 apps, 1 platform</li>
                <li><strong>Pro:</strong> $75/month - 6 apps, 1 platform</li>
                <li><strong>Enterprise:</strong> $299/month - All apps, all platforms</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Billing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscriptions are billed monthly in advance</li>
                <li>All fees are non-refundable except as specified in our refund policy</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
                <li>Failed payments may result in service suspension</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Free Trial</h3>
              <p>
                We offer a 14-day free trial for new users. No credit card is required to start. At the end of the trial, you must subscribe to continue using the services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund Policy</h2>
              <p>
                We offer a 14-day money-back guarantee for new subscriptions. If you are not satisfied with our services within the first 14 days of your paid subscription, you may request a full refund. After 14 days, refunds are not available.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Acceptable Use</h2>
              <p>You agree NOT to use our services to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Transmit malware, viruses, or malicious code</li>
                <li>Engage in fraudulent or deceptive activities</li>
                <li>Interfere with or disrupt our services or servers</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Harvest or collect user data without consent</li>
                <li>Send spam or unsolicited communications</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p>
                EZ Apps and its original content, features, and functionality are owned by EZ Apps and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="mt-4">
                You retain ownership of your data and content. By using our services, you grant us a limited license to use, store, and process your content solely to provide our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data and Privacy</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy. By using our services, you consent to our collection and use of data as described in the Privacy Policy.
              </p>
              <p className="mt-4">
                You are responsible for maintaining the confidentiality of your store's data and ensuring compliance with applicable data protection laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Integrations</h2>
              <p>
                Our services integrate with third-party e-commerce platforms. Your use of these platforms is subject to their respective terms of service. We are not responsible for the availability or performance of third-party services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Service Availability</h2>
              <p>
                We strive to maintain 99.9% uptime for our services. However, we do not guarantee uninterrupted access and may perform maintenance or updates that temporarily affect availability. We will provide reasonable notice for planned maintenance when possible.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, EZ APPS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
              </p>
              <p className="mt-4">
                OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF OUR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Disclaimer of Warranties</h2>
              <p>
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
              <p>
                You may cancel your subscription at any time through your account settings. We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              <p className="mt-4">
                Upon termination, your right to use the services will cease immediately. We may retain certain data as required by law or for legitimate business purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the new Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which EZ Apps operates, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Dispute Resolution</h2>
              <p>
                Any disputes arising from these Terms or your use of our services shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with applicable arbitration rules.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us at:</p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4">
                <p><strong>EZ Apps</strong></p>
                <p>Email: legal@ezapps.app</p>
                <p>Support: support@ezapps.app</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
