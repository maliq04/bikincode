'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowLeft, Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

interface Portfolio {
  id: string
  title: { en: string; id: string }
  category: { en: string; id: string }
  description: { en: string; id: string }
  projectDetails: { en: string; id: string }
  achievements: { en: string[]; id: string[] }
  results: { en: string; id: string }
  technologies: string[]
  images: string[]
  githubUrl?: string
  liveUrl?: string
  relatedProjects: string[]
}

export default function PortfolioDetail() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolio?t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          const item = data.find((p: Portfolio) => p.id === params.id)
          setPortfolio(item || null)
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [params.id])

  const nextImage = () => {
    if (portfolio && portfolio.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % portfolio.images.length)
    }
  }

  const prevImage = () => {
    if (portfolio && portfolio.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + portfolio.images.length) % portfolio.images.length)
    }
  }

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (portfolio && portfolio.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % portfolio.images.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [portfolio?.images.length, currentImageIndex])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-xl text-gray-600">Loading portfolio...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-3xl font-bold">
            {language === 'id' ? 'Portfolio tidak ditemukan' : 'Portfolio not found'}
          </h1>
          <button
            onClick={() => router.push('/#portfolio')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            {language === 'id' ? '← Kembali ke Portfolio' : '← Back to Portfolio'}
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
          onClick={() => router.push('/#portfolio')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'id' ? 'Kembali ke Portfolio' : 'Back to Portfolio'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Category Badge */}
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              {portfolio.category[language]}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {portfolio.title[language]}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8">
              {portfolio.description[language]}
            </p>

            {/* Image Carousel */}
            {portfolio.images && portfolio.images.length > 0 && (
              <div className="relative rounded-lg overflow-hidden mb-8 bg-gray-100">
                <img 
                  src={portfolio.images[currentImageIndex]} 
                  alt={`${portfolio.title[language]} - Image ${currentImageIndex + 1}`}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
                
                {/* Carousel Controls */}
                {portfolio.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {portfolio.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-white w-8' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Project Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'id' ? 'Detail Proyek' : 'Project Details'}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {portfolio.projectDetails[language]}
              </p>
            </div>

            {/* Our Achievements */}
            {portfolio.achievements[language].length > 0 && portfolio.achievements[language][0] !== '' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'id' ? 'Pencapaian Kami' : 'Our Achievements'}
                </h2>
                <ul className="space-y-3">
                  {portfolio.achievements[language].map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        ✓
                      </span>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Results */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'id' ? 'Hasil' : 'Results'}
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {portfolio.results[language]}
                </p>
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'id' ? 'Teknologi yang Digunakan' : 'Technologies Used'}
              </h2>
              <div className="flex flex-wrap gap-3">
                {portfolio.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Projects */}
            {portfolio.relatedProjects.length > 0 && portfolio.relatedProjects[0] !== '' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'id' ? 'Proyek Terkait' : 'Related Projects'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolio.relatedProjects.map((project, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
                    >
                      <p className="text-gray-700 font-medium">{project}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-6">
              {/* Project Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'id' ? 'Informasi Proyek' : 'Project Info'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'id' ? 'KATEGORI' : 'CATEGORY'}
                    </p>
                    <p className="font-bold text-gray-900">
                      {portfolio.category[language]}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'id' ? 'TEKNOLOGI' : 'TECHNOLOGIES'}
                    </p>
                    <p className="font-bold text-gray-900">
                      {portfolio.technologies.length} {language === 'id' ? 'teknologi' : 'technologies'}
                    </p>
                  </div>

                  {portfolio.images.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'id' ? 'GAMBAR' : 'IMAGES'}
                      </p>
                      <p className="font-bold text-gray-900">
                        {portfolio.images.length} {language === 'id' ? 'gambar' : 'images'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {portfolio.liveUrl && (
                  <a
                    href={portfolio.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>{language === 'id' ? 'Lihat Live Demo' : 'View Live Demo'}</span>
                  </a>
                )}

                {portfolio.githubUrl && (
                  <a
                    href={portfolio.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Github className="w-5 h-5" />
                    <span>{language === 'id' ? 'Lihat di GitHub' : 'View on GitHub'}</span>
                  </a>
                )}

                <button
                  onClick={() => router.push('/#portfolio')}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {language === 'id' ? 'Kembali ke Portfolio' : 'Back to Portfolio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
