'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { CheckCircle, Users, Award, TrendingUp } from 'lucide-react'

interface AboutData {
  companyName: { en: string; id: string }
  description: { en: string; id: string }
  vision: { en: string; id: string }
  mission: { en: string; id: string }
  companyLogo: string
  stats: {
    projects: number
    clients: number
    teamMembers: number
    satisfaction: number
  }
  technologies: string[]
}

export default function AboutPage() {
  const { language } = useLanguage()
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch(`/api/about?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setAboutData(data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  const stats = aboutData?.stats || { projects: 200, clients: 150, teamMembers: 25, satisfaction: 98 }
  const technologies = aboutData?.technologies || ['React', 'Next.js', 'Node.js', 'Laravel', 'Flutter', 'TypeScript', 'Python', 'PostgreSQL']

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Badge */}
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium">
              {language === 'id' ? 'Tentang Kami' : 'About Us'}
            </span>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-12 mb-16">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {aboutData?.companyName?.[language] || 'CV. BikinCode Solution'}
              </h1>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>{aboutData?.description?.[language] || 'Our company is an IT consulting firm based in Lahat Regency, South Sumatra, officially established in 2026...'}</p>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6">{language === 'id' ? 'Visi Kami' : 'Our Vision'}</h3>
                <p>{aboutData?.vision?.[language] || 'To become a key strategic partner supporting digital transformation in Indonesia...'}</p>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6">{language === 'id' ? 'Misi Kami' : 'Our Mission'}</h3>
                <p>{aboutData?.mission?.[language] || 'To provide innovative, reliable, and results-oriented technology services...'}</p>
              </div>
            </div>

            {/* Right: Logo */}
            <div className="flex items-start justify-center">
              {aboutData?.companyLogo ? (
                <img 
                  src={aboutData.companyLogo} 
                  alt="Company Logo"
                  className="w-full max-w-md h-auto object-contain"
                />
              ) : (
                <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Company Logo</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center px-2">
              {aboutData?.companyName?.[language] || 'CV. BikinCode Solution'}
            </h1>
            
            <div className="space-y-6 mb-8 text-gray-600">
              <p className="text-base leading-relaxed">{aboutData?.description?.[language] || 'Our company is an IT consulting firm based in Lahat Regency, South Sumatra, officially established in 2026. We specialize in providing innovative technology solutions to help businesses transform digitally and achieve their goals.'}</p>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{language === 'id' ? 'Visi Kami' : 'Our Vision'}</h3>
                <p className="text-base leading-relaxed">{aboutData?.vision?.[language] || 'To become a key strategic partner supporting digital transformation in Indonesia, delivering innovative and sustainable technology solutions.'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{language === 'id' ? 'Misi Kami' : 'Our Mission'}</h3>
                <p className="text-base leading-relaxed">{aboutData?.mission?.[language] || 'To provide innovative, reliable, and results-oriented technology services. We are committed to understanding client needs and delivering solutions that drive business growth.'}</p>
              </div>
            </div>

            {aboutData?.companyLogo && (
              <div className="flex justify-center mb-8 px-4">
                <img 
                  src={aboutData.companyLogo} 
                  alt="Company Logo"
                  className="w-full max-w-xs h-auto object-contain"
                />
              </div>
            )}
          </div>

          {/* Stats Cards & Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stats.projects}+</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{language === 'id' ? 'Proyek Sukses' : 'Successful Projects'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stats.clients}+</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{language === 'id' ? 'Klien Puas' : 'Satisfied Clients'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stats.teamMembers}+</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{language === 'id' ? 'Anggota Tim' : 'Team Members'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 rounded-xl">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stats.satisfaction}%</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{language === 'id' ? 'Kepuasan Pelanggan' : 'Customer Satisfaction'}</div>
              </div>
            </div>

            {/* Technologies Scroll */}
            <div className="w-full">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                {language === 'id' ? 'Teknologi yang Kami Kuasai' : 'Technologies We Master'}
              </h3>
              <div className="relative overflow-hidden bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex animate-scroll space-x-4 sm:space-x-6">
                  {[...technologies, ...technologies].map((tech, index) => (
                    <div 
                      key={index}
                      className="flex-shrink-0 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm border border-gray-200 font-medium text-gray-700 text-sm sm:text-base whitespace-nowrap"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
