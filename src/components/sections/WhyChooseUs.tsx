'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [companyLogo, setCompanyLogo] = useState('')
  const { t, language } = useLanguage()

  // Fetch company logo from settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/settings?t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          setCompanyLogo(data.companyLogo || '')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const allFeatures = [
    {
      icon: '⚡',
      title: language === 'id' ? 'Pengalaman 6+ Tahun' : '6+ Years Experience',
      description: language === 'id'
        ? 'Berpengalaman menangani lebih dari 200 proyek dari berbagai industri sejak tahun 2018.'
        : 'Experienced handling 200+ projects from various industries since 2018.'
    },
    {
      icon: 'B',
      title: language === 'id' ? 'Tim Profesional' : 'Professional Team',
      description: language === 'id'
        ? 'Didukung tim multidisiplin: UI/UX Designer, Frontend & Backend Developer, QA Engineer.'
        : 'Supported by multidisciplinary team: UI/UX Designer, Frontend & Backend Developer, QA Engineer.'
    },
    {
      icon: '💻',
      title: language === 'id' ? 'Teknologi Terkini' : 'Latest Technology',
      description: language === 'id'
        ? 'Menggunakan tech stack modern: Next.js, React, Node.js, Laravel, Flutter untuk hasil optimal.'
        : 'Using modern tech stack: Next.js, React, Node.js, Laravel, Flutter for optimal results.'
    },
    {
      icon: '🛡️',
      title: language === 'id' ? 'Support & Maintenance' : 'Support & Maintenance',
      description: language === 'id'
        ? 'Dukungan teknis berkelanjutan dan maintenance sesuai paket yang dipilih.'
        : 'Continuous technical support and maintenance according to selected package.'
    },
    {
      icon: '🚀',
      title: language === 'id' ? 'SEO Optimized' : 'SEO Optimized',
      description: language === 'id'
        ? 'Website dibangun dengan best practice SEO untuk meningkatkan visibility di search engine.'
        : 'Website built with SEO best practices to improve visibility in search engines.'
    },
    {
      icon: '📄',
      title: language === 'id' ? 'Source Code Ownership' : 'Source Code Ownership',
      description: language === 'id'
        ? 'Anda memiliki 100% hak kepemilikan source code dan dokumentasi lengkap.'
        : 'You own 100% of the source code rights and complete documentation.'
    }
  ]

  const totalSlides = allFeatures.length
  const desktopSlides = 2 // Desktop shows 4 cards at a time, so 2 slides total

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      
      // Show section when scrolled down at least 50% of viewport height
      if (scrollPosition > windowHeight * 0.5) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-slide every 2 seconds
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      // Check if desktop or mobile
      const isDesktop = window.innerWidth >= 1024
      const maxSlides = isDesktop ? desktopSlides : totalSlides
      
      setCurrentSlide(prev => (prev + 1) % maxSlides)
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible, totalSlides, desktopSlides])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className={`min-h-screen bg-white py-20 transition-all duration-1000 relative ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      {/* Wave Transition from Black to White */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-20" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-black"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-black"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-black"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
            {language === 'id' ? 'Keunggulan BikinCode' : 'BikinCode Advantages'}
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {language === 'id' ? 'Mengapa memilih BikinCode?' : 'Why choose BikinCode?'}
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'id' 
              ? 'Kami menghadirkan solusi digital yang tidak hanya cepat dan aman, tetapi juga dirancang untuk memberikan pengalaman terbaik bagi pengguna dan bisnis Anda.'
              : 'We provide digital solutions that are not only fast and secure, but also designed to provide the best experience for your users and business.'
            }
          </p>
        </div>

        {/* Mobile/Tablet: Carousel Container */}
        <div className="relative mb-12 lg:hidden">
          {/* Slides Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {allFeatures.map((feature, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div 
                    className={`bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 transition-all duration-300 transform ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                      <span className="text-3xl md:text-4xl font-bold text-white">B</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                      {feature.title}
                    </h3>
                    
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Carousel with 4 cards */}
        <div className="hidden lg:block relative mb-12">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1: Cards 0-3 */}
              <div className="w-full flex-shrink-0">
                <div className="grid grid-cols-4 gap-6">
                  {allFeatures.slice(0, 4).map((feature, index) => (
                    <div 
                      key={index}
                      className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                        <span className="text-2xl font-bold text-white">B</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide 2: Cards 4-5 + repeat 0-1 */}
              <div className="w-full flex-shrink-0">
                <div className="grid grid-cols-4 gap-6">
                  {allFeatures.slice(4, 6).concat(allFeatures.slice(0, 2)).map((feature, index) => (
                    <div 
                      key={index}
                      className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6">
                        <span className="text-2xl font-bold text-white">B</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Dots - All screens */}
        <div className="flex justify-center space-x-3 mb-20">
          {Array.from({ length: 2 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 hidden lg:block ${
                index === currentSlide 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 lg:hidden ${
                index === currentSlide 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Service Pillars Section */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
            {language === 'id' ? 'Pilar Layanan Kami' : 'Our Service Pillars'}
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {language === 'id' 
              ? 'Solusi web dan aplikasi kustom yang dapat diskalakan untuk bisnis Anda' 
              : 'Scalable web and custom application solutions for your business'}
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            {language === 'id'
              ? 'Dari penemuan hingga peluncuran, kami membangun produk digital dengan fondasi strategi, desain, dan rekayasa. Setiap paket mencakup dokumentasi, transfer pengetahuan, dan kolaborasi konten & sosial opsional.'
              : 'From discovery to launch, we build digital products with a foundation of strategy, design, and engineering. Each package includes documentation, knowledge transfer, and optional content & social collaboration.'}
          </p>

          {/* Company Logo */}
          {companyLogo && (
            <div className="flex justify-center">
              <img 
                src={companyLogo} 
                alt="Company Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}