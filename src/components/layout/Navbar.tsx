'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, User } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useServices } from '@/contexts/ServicesContext'

// Create a simple hook for settings that doesn't depend on context for non-admin pages
function useNavbarSettings() {
  const [settings, setSettings] = useState({
    companyName: 'BikinCode',
    companyLogo: '',
    adminAvatar: '',
    showServices: 'true',
    showPortfolio: 'true',
    showMarketplace: 'true',
    showAffiliate: 'true',
    showBlog: 'true',
    showContact: 'true',
    showAbout: 'true'
  })
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchSettings = async () => {
    try {
      // Add cache busting parameter
      const response = await fetch(`/api/settings?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Navbar settings fetched:', data)
        console.log('Navbar visibility settings:', {
          showServices: data.showServices,
          showPortfolio: data.showPortfolio,
          showMarketplace: data.showMarketplace,
          showAffiliate: data.showAffiliate,
          showBlog: data.showBlog,
          showContact: data.showContact,
          showAbout: data.showAbout
        })
        setSettings({
          companyName: data.companyName || 'BikinCode',
          companyLogo: data.companyLogo || '',
          adminAvatar: data.adminAvatar || '',
          showServices: data.showServices || 'true',
          showPortfolio: data.showPortfolio || 'true',
          showMarketplace: data.showMarketplace || 'true',
          showAffiliate: data.showAffiliate || 'true',
          showBlog: data.showBlog || 'true',
          showContact: data.showContact || 'true',
          showAbout: data.showAbout || 'true'
        })
      }
    } catch (error) {
      console.error('Error fetching navbar settings:', error)
      // Keep default values
    }
  }

  useEffect(() => {
    fetchSettings()

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      console.log('Settings update event received, refreshing navbar...')
      setRefreshKey(prev => prev + 1)
      // Small delay to ensure database is updated
      setTimeout(fetchSettings, 100)
    }

    // Add event listener for settings updates
    window.addEventListener('settingsUpdated', handleSettingsUpdate)

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate)
    }
  }, [refreshKey])

  return settings
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const navSettings = useNavbarSettings()
  const { companyName, companyLogo, adminAvatar, showServices, showPortfolio, showMarketplace, showAffiliate, showBlog, showContact, showAbout } = navSettings
  const { services, loading: servicesLoading } = useServices()

  // Debug: Log visibility settings when they change
  useEffect(() => {
    console.log('Navbar visibility updated:', {
      showServices,
      showPortfolio,
      showMarketplace,
      showAffiliate,
      showBlog,
      showContact,
      showAbout
    })
  }, [showServices, showPortfolio, showMarketplace, showAffiliate, showBlog, showContact, showAbout])

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-r from-white/25 via-black/95 to-black/95 backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt={companyName}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 rounded-lg object-cover"
                  onLoad={() => console.log('Company logo loaded:', companyLogo)}
                  onError={(e) => console.error('Company logo failed to load:', companyLogo, e)}
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xl sm:text-2xl md:text-xl">
                    {companyName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-white">
                <div className="font-bold text-lg sm:text-xl md:text-lg leading-tight">{companyName}</div>
                <div className="text-xs sm:text-sm md:text-xs text-gray-300 leading-tight">Solution</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-gray-300 font-medium transition-colors"
            >
              {t('home')}
            </Link>

            {/* Services Dropdown */}
            {showServices === 'true' && (
              <div 
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button 
                  className="text-white hover:text-gray-300 font-medium transition-colors flex items-center space-x-1"
                >
                  <span>{t('services')}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Services Dropdown Menu */}
                {isServicesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-6">
                    {servicesLoading ? (
                      <div className="text-center text-gray-400 py-8">
                        Loading services...
                      </div>
                    ) : services.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No services available
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          {services.map((service) => (
                            <Link
                              key={service.id}
                              href={`/services/${service.slug}`}
                              className="block p-4 rounded-lg hover:bg-white/10 transition-colors group"
                              onClick={() => setIsServicesOpen(false)}
                            >
                              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                                {service.title[language]}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {service.subtitle[language]}
                              </p>
                            </Link>
                          ))}
                        </div>
                        
                        <Link
                          href="/services"
                          className="block mt-4 pt-4 border-t border-gray-700 text-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          {language === 'id' ? 'Lihat Semua Layanan →' : 'View All Services →'}
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {showPortfolio === 'true' && (
              <Link 
                href="/portfolio" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                {t('portfolio')}
              </Link>
            )}

            {showMarketplace === 'true' && (
              <Link 
                href="/marketplace" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                {t('marketplace')}
              </Link>
            )}

            {showAffiliate === 'true' && (
              <Link 
                href="/affiliate" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                {t('affiliate')}
              </Link>
            )}

            {showBlog === 'true' && (
              <Link 
                href="/blog" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                {t('blog')}
              </Link>
            )}

            {showContact === 'true' && (
              <Link 
                href="/contact" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                {t('contact')}
              </Link>
            )}

            {showAbout === 'true' && (
              <Link 
                href="/about" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                {t('about')}
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            
            {/* Language Switcher - Desktop Only */}
            <div className="hidden md:block relative">
              <div 
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <div className={`w-6 h-4 rounded-sm border border-gray-400 ${
                  language === 'id' 
                    ? 'bg-gradient-to-b from-red-500 to-white' 
                    : 'bg-gradient-to-b from-blue-500 to-red-500'
                }`}></div>
                <span className="text-white text-sm font-medium">
                  {language === 'id' ? 'ID' : 'EN'}
                </span>
                <ChevronDown className="h-3 w-3 text-white" />
              </div>

              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-md shadow-lg">
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsLanguageOpen(false)
                    }}
                    className="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                  >
                    <div className="w-4 h-3 bg-gradient-to-b from-blue-500 to-red-500 rounded-sm border border-gray-400"></div>
                    <span className="text-sm">English</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('id')
                      setIsLanguageOpen(false)
                    }}
                    className="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                  >
                    <div className="w-4 h-3 bg-gradient-to-b from-red-500 to-white rounded-sm border border-gray-400"></div>
                    <span className="text-sm">Indonesia</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile - Desktop Only */}
            <div className="hidden md:block relative">
              {adminAvatar ? (
                <Link href="/admin">
                  <img 
                    src={adminAvatar} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-white/20 transition-all"
                    onLoad={() => console.log('Admin avatar loaded:', adminAvatar)}
                    onError={(e) => console.error('Admin avatar failed to load:', adminAvatar, e)}
                  />
                </Link>
              ) : (
                <Link href="/admin" className="text-white hover:text-gray-300 transition-colors p-2">
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-white"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-700 bg-gradient-to-r from-white/25 via-black/95 to-black/95 border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-white hover:text-gray-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('home')}
              </Link>
              
              {showServices === 'true' && (
                <Link
                  href="/services"
                  className="block px-3 py-2 text-white hover:text-gray-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('services')}
                </Link>
              )}

              {showPortfolio === 'true' && (
                <Link
                  href="/portfolio"
                  className="block px-3 py-2 text-white hover:text-gray-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('portfolio')}
                </Link>
              )}

              {showMarketplace === 'true' && (
                <Link
                  href="/marketplace"
                  className="block px-3 py-2 text-white hover:text-gray-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('marketplace')}
                </Link>
              )}

              {showAffiliate === 'true' && (
                <Link
                  href="/affiliate"
                  className="block px-3 py-2 text-white hover:text-gray-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('affiliate')}
                </Link>
              )}

              {showBlog === 'true' && (
                <Link
                  href="/blog"
                  className="block px-3 py-2 text-white hover:text-gray-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('blog')}
                </Link>
              )}

              {showContact === 'true' && (
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-white hover:text-gray-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('contact')}
                </Link>
              )}

              {showAbout === 'true' && (
                <Link
                  href="/about"
                  className="block px-3 py-2 text-white hover:text-gray-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('about')}
                </Link>
              )}

              {/* Language Switcher - Mobile */}
              <div className="px-3 py-2">
                <div className="text-gray-400 text-xs font-medium mb-2">
                  {language === 'id' ? 'Bahasa' : 'Language'}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsOpen(false)
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      language === 'en' 
                        ? 'bg-white/20 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="w-4 h-3 bg-gradient-to-b from-blue-500 to-red-500 rounded-sm border border-gray-400"></div>
                    <span className="text-sm">EN</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('id')
                      setIsOpen(false)
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      language === 'id' 
                        ? 'bg-white/20 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="w-4 h-3 bg-gradient-to-b from-red-500 to-white rounded-sm border border-gray-400"></div>
                    <span className="text-sm">ID</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}