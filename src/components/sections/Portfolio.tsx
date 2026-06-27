'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ExternalLink, Github } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Portfolio {
  id: string
  title: { en: string; id: string }
  category: { en: string; id: string }
  description: { en: string; id: string }
  technologies: string[]
  images: string[]
  githubUrl?: string
  liveUrl?: string
  status?: string
}

export function Portfolio() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolios()

    // Listen for portfolio updates
    const handlePortfolioUpdate = () => {
      console.log('Portfolio update event received, refreshing...')
      fetchPortfolios()
    }

    window.addEventListener('portfolioUpdated', handlePortfolioUpdate)

    return () => {
      window.removeEventListener('portfolioUpdated', handlePortfolioUpdate)
    }
  }, [])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch(`/api/portfolio?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        // Filter only published portfolios
        const publishedPortfolios = data.filter((p: Portfolio) => p.status === 'published' || !p.status)
        setPortfolios(publishedPortfolios)
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories from portfolios
  const categories = ['All', ...Array.from(new Set(portfolios.map(p => p.category[language])))]

  const filteredItems = activeCategory === 'All' 
    ? portfolios 
    : portfolios.filter(item => item.category[language] === activeCategory)

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl text-gray-600">Loading portfolio...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('portfolioTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('portfolioSubtitle')}
          </p>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === 'id' ? 'Belum ada portfolio tersedia' : 'No portfolio items available yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => router.push(`/portfolio/${item.id}`)}
                >
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title[language]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                        <div className="text-primary-600 font-bold text-lg text-center px-4">
                          {item.title[language]}
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center space-x-4 transition-opacity duration-300 ${
                      hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-primary-600 hover:text-white transition-colors"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-primary-600 hover:text-white transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {item.category[language]}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.title[language]}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                      {item.description[language]}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {item.technologies.length > 4 && (
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          +{item.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            {portfolios.length > 6 && (
              <div className="text-center mt-12">
                <button className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  {t('viewAllProjects')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}