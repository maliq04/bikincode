'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useServices } from '@/contexts/ServicesContext'
import { ArrowLeft } from 'lucide-react'

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const { getSetting } = useSettings()
  const { getServiceBySlug, loading } = useServices()
  const [whatsappUrl, setWhatsappUrl] = useState('')
  
  const service = getServiceBySlug(params.slug as string)

  // Clean and format phone number for WhatsApp
  const cleanPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/[^0-9]/g, '')
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1)
    }
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned
    }
    return cleaned
  }

  // Update WhatsApp URL whenever settings or service changes
  useEffect(() => {
    if (service) {
      const contactPhone = getSetting('contactPhone', '+62 813 6124 9456')
      const whatsappNumber = cleanPhoneNumber(contactPhone)
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello! I'm interested in ${service.title[language]}`)}`
      setWhatsappUrl(url)
      console.log('Service Detail: WhatsApp URL updated:', url, 'from phone:', contactPhone)
    }
  }, [service, language, getSetting])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-xl text-gray-600">Loading service...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-3xl font-bold">
            {language === 'id' ? 'Layanan tidak ditemukan' : 'Service not found'}
          </h1>
          <button
            onClick={() => router.push('/services')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            {language === 'id' ? '← Kembali ke Layanan' : '← Back to Services'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'id' ? 'Kembali ke Layanan' : 'Back to Services'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Badge */}
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              {language === 'id' ? 'LAYANAN' : 'SERVICE'}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {service.title[language]}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-6">
              {service.subtitle[language]}
            </p>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {service.description[language]}
            </p>

            {/* Price Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                {service.price[language]}
              </div>
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium">
                {service.process[language].length} {language === 'id' ? 'langkah proses' : 'process steps'}
              </div>
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium">
                {service.packages[language].length} {language === 'id' ? 'paket tersedia' : 'packages available'}
              </div>
            </div>

            {/* Image */}
            {service.image ? (
              <div className="rounded-lg overflow-hidden mb-8">
                <img 
                  src={service.image} 
                  alt={service.title[language]}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-48 sm:h-56 md:h-64 flex items-center justify-center mb-8">
                <span className="text-gray-500">Service Image</span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              {/* Service Summary */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'id' ? 'Ringkasan Layanan' : 'Service Summary'}
              </h3>

              {/* Service Name */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'id' ? 'LAYANAN' : 'SERVICE'}
                </p>
                <p className="font-bold text-gray-900">
                  {service.title[language]}
                </p>
              </div>

              {/* Starting Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'id' ? 'HARGA MULAI' : 'STARTING PRICE'}
                </p>
                <p className="font-bold text-gray-900">
                  {service.price[language]}
                </p>
              </div>

              {/* Process Steps */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'id' ? 'PROSES' : 'PROCESS'}
                </p>
                <p className="font-bold text-gray-900">
                  {service.process[language].length} {language === 'id' ? 'langkah' : 'steps'}
                </p>
              </div>

              {/* Available Packages */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'id' ? 'PAKET TERSEDIA' : 'AVAILABLE PACKAGES'}
                </p>
                <p className="font-bold text-gray-900">
                  {service.packages[language].length} {language === 'id' ? 'paket' : 'packages'}
                </p>
              </div>

              {/* Consult Now Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white text-center py-3 rounded-lg font-medium hover:bg-green-600 transition-colors mb-3 flex items-center justify-center space-x-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>{language === 'id' ? 'Konsultasi Sekarang' : 'Consult Now'}</span>
              </a>

              {/* View Other Services Button */}
              <button
                onClick={() => router.push('/services')}
                className="block w-full bg-white border-2 border-gray-300 text-gray-700 text-center py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {language === 'id' ? 'Lihat Layanan Lain' : 'View Other Services'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
