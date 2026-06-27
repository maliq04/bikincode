'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react'
import { ImageUpload } from '@/components/ui/ImageUpload'

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

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: { en: '', id: '' },
    slug: '',
    excerpt: { en: '', id: '' },
    content: { en: '', id: '' },
    category: { en: '', id: '' },
    tags: [] as string[],
    image: '',
    author: 'Admin',
    status: 'published' as 'published' | 'draft',
    featured: false
  })

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`/api/blog?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingBlog ? '/api/blog' : '/api/blog'
      const method = editingBlog ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog ? { id: editingBlog.id, ...formData } : formData)
      })

      if (response.ok) {
        await fetchBlogs()
        setIsModalOpen(false)
        resetForm()
        window.dispatchEvent(new CustomEvent('blogUpdated'))
      }
    } catch (error) {
      console.error('Error saving blog:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchBlogs()
        window.dispatchEvent(new CustomEvent('blogUpdated'))
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags,
      image: blog.image,
      author: blog.author,
      status: blog.status,
      featured: blog.featured || false
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setEditingBlog(null)
    setFormData({
      title: { en: '', id: '' },
      slug: '',
      excerpt: { en: '', id: '' },
      content: { en: '', id: '' },
      category: { en: '', id: '' },
      tags: [],
      image: '',
      author: 'Admin',
      status: 'published',
      featured: false
    })
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 h-8 w-8" />
            Blog Management
          </h1>
          <p className="text-gray-600 mt-2">Create and manage blog posts</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Blog Post
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-6">
              {blog.image && (
                <img 
                  src={blog.image} 
                  alt={blog.title.en}
                  className="w-48 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title.en}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt.en}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {blog.views} views
                      </span>
                      <span>{blog.category.en}</span>
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">
                {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title.en}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        title: { ...prev.title, en: e.target.value },
                        slug: prev.slug || generateSlug(e.target.value)
                      }))
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (Indonesian)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, id: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'published' | 'draft' }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Featured Article</span>
                      <p className="text-xs text-gray-500">Show this article in featured section</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      category: { ...prev.category, en: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (Indonesian)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      category: { ...prev.category, id: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  currentImageUrl={formData.image}
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  uploadPath="blog"
                  label="Featured Image"
                  description="Upload a featured image for the blog post (max 5MB)"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (English)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.excerpt.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      excerpt: { ...prev.excerpt, en: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Indonesian)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.excerpt.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      excerpt: { ...prev.excerpt, id: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (English)
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, en: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Indonesian)
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, id: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingBlog ? 'Update' : 'Create'} Blog Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
