'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react'

interface Portfolio {
  id?: string
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
  status?: string
  createdAt?: number
  updatedAt?: number
}

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState<Portfolio>({
    title: { en: '', id: '' },
    category: { en: '', id: '' },
    description: { en: '', id: '' },
    projectDetails: { en: '', id: '' },
    achievements: { en: [''], id: [''] },
    results: { en: '', id: '' },
    technologies: [''],
    images: [],
    githubUrl: '',
    liveUrl: '',
    relatedProjects: [''],
    status: 'published'
  })

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolio')
      if (response.ok) {
        const data = await response.json()
        setPortfolios(data)
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingPortfolio ? 'PUT' : 'POST'
      const body = editingPortfolio 
        ? { ...formData, id: editingPortfolio.id }
        : formData

      const response = await fetch('/api/portfolio', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        await fetchPortfolios()
        resetForm()
        alert(editingPortfolio ? 'Portfolio updated!' : 'Portfolio created!')
        
        window.dispatchEvent(new Event('portfolioUpdated'))
      } else {
        if (data.code === 'PERMISSION_DENIED') {
          alert(`❌ Firebase Permission Denied\n\n${data.error}\n\n${data.details}`)
        } else {
          alert(`Failed to save portfolio: ${data.error || 'Unknown error'}`)
        }
      }
    } catch (error) {
      console.error('Error saving portfolio:', error)
      alert('Failed to save portfolio')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return

    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPortfolios()
        alert('Portfolio deleted!')
        window.dispatchEvent(new Event('portfolioUpdated'))
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error)
      alert('Failed to delete portfolio')
    }
  }

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio)
    setFormData(portfolio)
    setIsFormOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: { en: '', id: '' },
      category: { en: '', id: '' },
      description: { en: '', id: '' },
      projectDetails: { en: '', id: '' },
      achievements: { en: [''], id: [''] },
      results: { en: '', id: '' },
      technologies: [''],
      images: [],
      githubUrl: '',
      liveUrl: '',
      relatedProjects: [''],
      status: 'published'
    })
    setEditingPortfolio(null)
    setIsFormOpen(false)
  }

  const addArrayItem = (field: 'achievements' | 'technologies' | 'relatedProjects', lang?: 'en' | 'id') => {
    if (field === 'technologies' || field === 'relatedProjects') {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }))
    } else if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: [...prev[field][lang], '']
        }
      }))
    }
  }

  const removeArrayItem = (field: 'achievements' | 'technologies' | 'relatedProjects', index: number, lang?: 'en' | 'id') => {
    if (field === 'technologies' || field === 'relatedProjects') {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    } else if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: prev[field][lang].filter((_, i) => i !== index)
        }
      }))
    }
  }

  const updateArrayItem = (field: 'achievements' | 'technologies' | 'relatedProjects', index: number, value: string, lang?: 'en' | 'id') => {
    if (field === 'technologies' || field === 'relatedProjects') {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }))
    } else if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: prev[field][lang].map((item, i) => i === index ? value : item)
        }
      }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('uploadPath', 'portfolio')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.url)
        }
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload some images')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading portfolios...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Portfolio</span>
        </button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map(portfolio => (
          <div key={portfolio.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {portfolio.images && portfolio.images.length > 0 ? (
              <img 
                src={portfolio.images[0]} 
                alt={portfolio.title.en}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="p-6">
              <div className="text-sm text-blue-600 font-medium mb-2">{portfolio.category.en}</div>
              <h3 className="text-xl font-bold mb-2">{portfolio.title.en}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{portfolio.description.en}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {portfolio.technologies.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
                {portfolio.technologies.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    +{portfolio.technologies.length - 3}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(portfolio)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(portfolio.id!)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-6xl w-full my-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">
                {editingPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, en: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title (Indonesian) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, id: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., E-Commerce, Mobile App"
                    value={formData.category.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      category: { ...prev.category, en: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category (Indonesian) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., E-Commerce, Aplikasi Mobile"
                    value={formData.category.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      category: { ...prev.category, id: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Description (English) *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Indonesian) *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: { ...prev.description, id: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Details (English) *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detailed information about the project..."
                    value={formData.projectDetails.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      projectDetails: { ...prev.projectDetails, en: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Details (Indonesian) *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Informasi detail tentang proyek..."
                    value={formData.projectDetails.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      projectDetails: { ...prev.projectDetails, id: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Our Achievements */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Our Achievements (English)</label>
                  {formData.achievements.en.map((achievement, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={achievement}
                        placeholder="Achievement"
                        onChange={(e) => updateArrayItem('achievements', index, e.target.value, 'en')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.achievements.en.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('achievements', index, 'en')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('achievements', 'en')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Achievement
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Our Achievements (Indonesian)</label>
                  {formData.achievements.id.map((achievement, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={achievement}
                        placeholder="Pencapaian"
                        onChange={(e) => updateArrayItem('achievements', index, e.target.value, 'id')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.achievements.id.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('achievements', index, 'id')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('achievements', 'id')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Achievement
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Results (English) *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Project outcomes and results..."
                    value={formData.results.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      results: { ...prev.results, en: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Results (Indonesian) *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Hasil dan outcome proyek..."
                    value={formData.results.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      results: { ...prev.results, id: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium mb-2">Technologies Used *</label>
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tech}
                      placeholder="e.g., React, Node.js, MongoDB"
                      onChange={(e) => updateArrayItem('technologies', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {formData.technologies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('technologies', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('technologies')}
                  className="text-blue-600 text-sm hover:text-blue-800"
                >
                  + Add Technology
                </button>
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Project Images (Multiple)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {formData.images.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Project ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              Image {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      <label className="cursor-pointer">
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                          <span className="text-sm text-blue-600 font-medium">Add More Images</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploadingImages}
                          />
                        </div>
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload project images
                          </span>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                          <p className="mt-1 text-xs text-blue-600">You can select multiple images at once</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploadingImages}
                        />
                      </div>
                    </label>
                  )}
                  {uploadingImages && (
                    <div className="text-center text-blue-600 mt-4">
                      Uploading images...
                    </div>
                  )}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Live URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.liveUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Related Projects */}
              <div>
                <label className="block text-sm font-medium mb-2">Related Projects</label>
                {formData.relatedProjects.map((project, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={project}
                      placeholder="Related project name or ID"
                      onChange={(e) => updateArrayItem('relatedProjects', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {formData.relatedProjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('relatedProjects', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('relatedProjects')}
                  className="text-blue-600 text-sm hover:text-blue-800"
                >
                  + Add Related Project
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImages}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingPortfolio ? 'Update Portfolio' : 'Create Portfolio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
