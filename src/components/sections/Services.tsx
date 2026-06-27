'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useServices } from '@/contexts/ServicesContext'
import Link from 'next/link'
import { 
  Building2, 
  ShoppingCart, 
  Smartphone, 
  Rocket, 
  Newspaper,
  ArrowRight,
  Code,
  Globe
} from 'lucide-react'

// Icon mapping for services
const iconMap: Record<string, any> = {
  'company-profile-website': Building2,
  'ecommerce-website': ShoppingCart,
  'custom-website-system': Code,
  'mobile-application': Smartphone,
  'landing-page': Rocket,
  'news-portal-website': Newspaper,
  'default': Globe
}

// Color mapping for services
const colorMap: Record<string, string> = {
  'company-profile-website': 'from-blue-500 to-blue-600',
  'ecommerce-website': 'from-green-500 to-green-600',
  'custom-website-system': 'from-purple-500 to-purple-600',
  'mobile-application': 'from-indigo-500 to-indigo-600',
  'landing-page': 'from-orange-500 to-orange-600',
  'news-portal-website': 'from-red-500 to-red-600',
  'default': 'from-gray-500 to-gray-600'
}

export function Services() {
  const { t, language } = useLanguage()
  const { services, loading } = useServices()

  if (loading) {
    return (
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl text-gray-600">Loading services...</div>
          </div>
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('servicesTitle')}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'id' ? 'Belum ada layanan tersedia' : 'No services available yet'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('servicesTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('servicesSubtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.slug] || iconMap['default']
            const colorClass = colorMap[service.slug] || colorMap['default']
            
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative"
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {service.title[language]}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.subtitle[language]}
                </p>

                {/* Price */}
                <div className="text-blue-600 font-semibold mb-4">
                  {service.price[language]}
                </div>

                {/* Learn More Link */}
                <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                  <span>{t('learnMore')}</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('readyToStart')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('letsDiscuss')}
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {t('getFreeConsultation')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}