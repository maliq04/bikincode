'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Service {
  id?: string
  slug: string
  title: { en: string; id: string }
  subtitle: { en: string; id: string }
  description: { en: string; id: string }
  price: { en: string; id: string }
  image?: string
  features: { en: string[]; id: string[] }
  process: { en: string[]; id: string[] }
  packages: { en: string[]; id: string[] }
  status?: string
  createdAt?: number
  updatedAt?: number
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<Service>({
    slug: '',
    title: { en: '', id: '' },
    subtitle: { en: '', id: '' },
    description: { en: '', id: '' },
    price: { en: '', id: '' },
    features: { en: [''], id: [''] },
    process: { en: [''], id: [''] },
    packages: { en: [''], id: [''] },
    status: 'active'
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingService ? 'PUT' : 'POST'
      const body = editingService 
        ? { ...formData, id: editingService.id }
        : formData

      const response = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        await fetchServices()
        resetForm()
        alert(editingService ? 'Service updated!' : 'Service created!')
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('servicesUpdated'))
      } else {
        // Show helpful error message for permission issues
        if (data.code === 'PERMISSION_DENIED') {
          alert(`❌ Firebase Permission Denied\n\n${data.error}\n\n${data.details}\n\nPlease check FIREBASE-SETUP.md for instructions.`)
        } else {
          alert(`Failed to save service: ${data.error || 'Unknown error'}`)
        }
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service. Please check your Firebase configuration.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchServices()
        alert('Service deleted!')
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('servicesUpdated'))
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData(service)
    setIsFormOpen(true)
  }

  const resetForm = () => {
    setFormData({
      slug: '',
      title: { en: '', id: '' },
      subtitle: { en: '', id: '' },
      description: { en: '', id: '' },
      price: { en: '', id: '' },
      features: { en: [''], id: [''] },
      process: { en: [''], id: [''] },
      packages: { en: [''], id: [''] },
      status: 'active'
    })
    setEditingService(null)
    setIsFormOpen(false)
  }

  const addArrayItem = (field: 'features' | 'process' | 'packages', lang: 'en' | 'id') => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: [...prev[field][lang], '']
      }
    }))
  }

  const removeArrayItem = (field: 'features' | 'process' | 'packages', lang: 'en' | 'id', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: prev[field][lang].filter((_, i) => i !== index)
      }
    }))
  }

  const updateArrayItem = (field: 'features' | 'process' | 'packages', lang: 'en' | 'id', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: prev[field][lang].map((item, i) => i === index ? value : item)
      }
    }))
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading services...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Firebase Setup Notice */}
      {services.length === 0 && !loading && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                No services yet - Get started!
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Before adding services, make sure Firebase database rules are configured. 
                Check <strong>FIREBASE-SETUP.md</strong> for instructions.
              </p>
              <div className="flex space-x-3 text-sm">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  → Add your first service
                </button>
                <span className="text-blue-400">|</span>
                <a
                  href="/FIREBASE-SETUP.md"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  → View setup guide
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-2">{service.title.en}</h3>
            <p className="text-gray-600 mb-2">{service.subtitle.en}</p>
            <p className="text-blue-600 font-semibold mb-4">{service.price.en}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(service)}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 flex items-center justify-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(service.id!)}
                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 flex items-center justify-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.title.en}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        title: { ...prev.title, en: value },
                        slug: generateSlug(value)
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title (Indonesian)</label>
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

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              {/* Subtitle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subtitle: { ...prev.subtitle, en: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle (Indonesian)</label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subtitle: { ...prev.subtitle, id: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="Starting from Rp 15 million"
                    value={formData.price.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      price: { ...prev.price, en: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price (Indonesian)</label>
                  <input
                    type="text"
                    required
                    placeholder="Mulai dari Rp 15 juta"
                    value={formData.price.id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      price: { ...prev.price, id: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Description (English)</label>
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
                  <label className="block text-sm font-medium mb-2">Description (Indonesian)</label>
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

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Features (English)</label>
                  {formData.features.en.map((feature, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateArrayItem('features', 'en', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.features.en.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('features', 'en', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('features', 'en')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Feature
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Features (Indonesian)</label>
                  {formData.features.id.map((feature, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateArrayItem('features', 'id', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.features.id.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('features', 'id', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('features', 'id')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Process Steps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Process Steps (English)</label>
                  {formData.process.en.map((step, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={step}
                        placeholder={`Step ${index + 1}`}
                        onChange={(e) => updateArrayItem('process', 'en', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.process.en.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('process', 'en', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('process', 'en')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Process Step
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Process Steps (Indonesian)</label>
                  {formData.process.id.map((step, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={step}
                        placeholder={`Langkah ${index + 1}`}
                        onChange={(e) => updateArrayItem('process', 'id', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.process.id.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('process', 'id', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('process', 'id')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Process Step
                  </button>
                </div>
              </div>

              {/* Packages */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Available Packages (English)</label>
                  {formData.packages.en.map((pkg, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={pkg}
                        placeholder="Package name"
                        onChange={(e) => updateArrayItem('packages', 'en', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.packages.en.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('packages', 'en', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('packages', 'en')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Package
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available Packages (Indonesian)</label>
                  {formData.packages.id.map((pkg, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={pkg}
                        placeholder="Nama paket"
                        onChange={(e) => updateArrayItem('packages', 'id', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      {formData.packages.id.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('packages', 'id', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('packages', 'id')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Package
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Service Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {formData.image ? (
                    <div className="space-y-4">
                      <img 
                        src={formData.image} 
                        alt="Service preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-4">
                        <label className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload an image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const uploadFormData = new FormData()
                                uploadFormData.append('file', file)
                                uploadFormData.append('uploadPath', 'services')
                                
                                try {
                                  const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: uploadFormData
                                  })
                                  
                                  if (response.ok) {
                                    const data = await response.json()
                                    setFormData(prev => ({ ...prev, image: data.url }))
                                  } else {
                                    const errorData = await response.json()
                                    alert(`Failed to upload image: ${errorData.error || 'Unknown error'}`)
                                  }
                                } catch (error) {
                                  console.error('Error uploading image:', error)
                                  alert('Failed to upload image')
                                }
                              }
                            }}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
