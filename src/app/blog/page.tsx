'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { Calendar, Eye, ArrowRight, Search, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: { en: string; id: string }
  slug: string
  excerpt: { en: string; id: string }
  category: { en: string; id: string }
  image: string
  author: string
  status: string
  date: string
  views: number
  readTime?: number
  featured?: boolean
}

export default function BlogPage() {
  const { language } = useLanguage()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [popularBlogs, setPopularBlogs] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchBlogs()

    const handleBlogUpdate = () => {
      fetchBlogs()
    }

    window.addEventListener('blogUpdated', handleBlogUpdate)
    return () => window.removeEventListener('blogUpdated', handleBlogUpdate)
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`/api/blog?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        const published = data.filter((blog: BlogPost) => blog.status === 'published')
        setBlogs(published)
        
        // Get popular blogs (top 5 by views)
        const popular = [...published]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
        setPopularBlogs(popular)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...Array.from(new Set(blogs.map(blog => blog.category[language])))]
  
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category[language] === selectedCategory
    const matchesSearch = searchQuery === '' || 
      blog.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt[language].toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalArticles = blogs.length
  const totalCategories = categories.length - 1
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#f0f4f8] text-gray-900 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-700 text-sm font-medium mb-4 uppercase tracking-wider">
              {language === 'id' ? 'Blog & Artikel' : 'Blog & Articles'}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              {language === 'id' ? 'BikinCode Insights dan Artikel' : 'BikinCode Insights and Articles'}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              {language === 'id' 
                ? 'Kami mendokumentasikan pelajaran dari proyek, eksperimen teknologi, dan praktik terbaik dalam membangun produk digital.' 
                : 'We document lessons from projects, technology experiments, and best practices in building digital products.'}
            </p>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{totalArticles}+</div>
                <div className="text-gray-700 text-sm">
                  {language === 'id' ? 'Artikel' : 'Articles'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{totalCategories}+</div>
                <div className="text-gray-700 text-sm">
                  {language === 'id' ? 'Kategori' : 'Categories'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">{totalViews}+</div>
                <div className="text-gray-700 text-sm">
                  {language === 'id' ? 'Pembaca Aktif' : 'Active Readers'}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder={language === 'id' ? 'Cari artikel...' : 'Search articles...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading articles...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Posts - Full width on mobile, 2 cols on tablet/desktop */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {filteredBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group bg-[#f8fafb] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
                  >
                    {/* Image */}
                    <div className="relative sm:w-64 h-48 sm:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                      {blog.image ? (
                        <img 
                          src={blog.image} 
                          alt={blog.title[language]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <div className="text-gray-600 font-bold text-center">
                            {blog.title[language]}
                          </div>
                        </div>
                      )}
                      {blog.featured && (
                        <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                          {blog.category[language]}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(blog.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                        {blog.title[language]}
                      </h3>

                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {blog.excerpt[language]}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          {blog.readTime && (
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {blog.readTime} min
                            </span>
                          )}
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {blog.views}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700 font-medium group-hover:translate-x-2 transition-transform">
                          {language === 'id' ? 'Baca' : 'Read'}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredBlogs.length === 0 && blogs.length > 0 && (
                <div className="text-center py-12 bg-[#f8fafb] rounded-xl">
                  <p className="text-gray-500">
                    {language === 'id' ? 'Tidak ada artikel yang cocok dengan pencarian Anda' : 'No articles match your search'}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar - Hidden on Mobile, Visible on Tablet/Desktop */}
            <div className="hidden md:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Popular Articles */}
                <div className="bg-[#f8fafb] rounded-xl p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-5 h-5 text-gray-700 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {language === 'id' ? 'Artikel Populer' : 'Popular Articles'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {language === 'id' ? 'Paling banyak dibaca' : 'Most read'}
                  </p>
                  <div className="space-y-4">
                    {popularBlogs.map((blog, index) => (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.slug}`}
                        className="group flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        {blog.image ? (
                          <img 
                            src={blog.image} 
                            alt={blog.title[language]}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-400">{index + 1}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 font-medium mb-1">
                            {blog.category[language]}
                          </p>
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                            {blog.title[language]}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(blog.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div className="bg-[#f8fafb] rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {language === 'id' ? 'Kategori Populer' : 'Popular Categories'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {language === 'id' ? 'Topik paling populer' : 'Most popular topics'}
                  </p>
                  <div className="space-y-2">
                    {categories.filter(c => c !== 'All').map((category) => {
                      const count = blogs.filter(b => b.category[language] === category).length
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="font-medium text-gray-700">{category}</span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
