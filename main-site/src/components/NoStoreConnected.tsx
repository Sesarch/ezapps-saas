'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface NoStoreConnectedProps {
  pageTitle: string;
  pageIcon: string;
  description: string;
  features: string[];
  showConnectButton?: boolean;
}

export default function NoStoreConnected({
  pageTitle,
  pageIcon,
  description,
  features,
  showConnectButton = true
}: NoStoreConnectedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-indigo-100"
        >
          <div className="text-8xl mb-6">{pageIcon}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            No Store Connected
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {description}
          </p>
          
          <div className="bg-indigo-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-indigo-900 mb-3">{pageIcon} {pageTitle}?</h3>
            <ul className="space-y-2 text-gray-700">
              {features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          {showConnectButton && (
            <>
              <Link
                href="/dashboard/stores"
                className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105"
              >
                🚀 Connect Your First Store
              </Link>

              <p className="text-sm text-gray-500 mt-6">
                Supports: Shopify • WooCommerce • Wix • and more
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
