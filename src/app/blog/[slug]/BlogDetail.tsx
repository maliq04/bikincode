'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowLeft, Calendar, Eye, User, Tag } from 'lucide-react'

interface BlogPost {
  id: string
  title: { en: string; id: string }
  slug: string
  excerpt: { en: string; id: string }
  content: { en: string; id: string }
  category: { en: string; id: string }
  tags: string[]
  image: string
  author: string
  status: 'published' | 'draft'
  date: string
  views: number
  featured?: boolean
}

export default function BlogDetail() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchBlog()
  }, [params.slug])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blog?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        const foundBlog = data.find((b: BlogPost) => b.slug === params.slug && b.status === 'published')
        
        if (foundBlog) {
          setBlog(foundBlog)
          
          // Get related blogs from same category
          const related = data
            .filter((b: BlogPost) => 
              b.id !== foundBlog.id && 
              b.category[language] === foundBlog.category[language] &&
              b.status === 'published'
            )
            .slice(0, 3)
          setRelatedBlogs(related)
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-xl text-gray-600">Loading blog post...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#f0f4f8]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-3xl font-bold">
            {language === 'id' ? 'Blog tidak ditemukan' : 'Blog not found'}
          </h1>
          <button
            onClick={() => router.push('/blog')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            {language === 'id' ? '← Kembali ke Blog' : '← Back to Blog'}
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Navbar />
      
      <article className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'id' ? 'Kembali ke Blog' : 'Back to Blog'}</span>
          </button>

          {/* Category Badge */}
          <div className="inline-block bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            {blog.category[language]}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {blog.title[language]}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              {blog.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(blog.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              {blog.views} {language === 'id' ? 'views' : 'views'}
            </div>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img 
                src={blog.image} 
                alt={blog.title[language]}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {blog.content[language]}
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-12 pb-12 border-b border-gray-200">
              <Tag className="w-5 h-5 text-gray-600" />
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'id' ? 'Artikel Terkait' : 'Related Articles'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <a
                    key={relatedBlog.id}
                    href={`/blog/${relatedBlog.slug}`}
                    className="group bg-[#f8fafb] rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {relatedBlog.image && (
                      <img 
                        src={relatedBlog.image} 
                        alt={relatedBlog.title[language]}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {relatedBlog.title[language]}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedBlog.excerpt[language]}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  )
}
