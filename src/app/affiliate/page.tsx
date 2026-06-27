'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AffiliatePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('affiliateTitle')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              {t('affiliateSubtitle')}
            </p>
            
            <div className="bg-gray-900 rounded-2xl p-12 shadow-lg border border-gray-700">
              <div className="text-6xl mb-4">🤝</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('affiliateComingSoon')}
              </h2>
              <p className="text-gray-400">
                {t('affiliateDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}