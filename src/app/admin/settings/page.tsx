'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, User, Building2, Globe, X } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { ImageUpload } from '@/components/ui/ImageUpload'

interface SettingsData {
  // Brand Settings
  companyName?: string
  companyLogo?: string
  brandColor?: string
  
  // Profile Settings
  adminName?: string
  adminEmail?: string
  adminAvatar?: string
  
  // Website Settings
  websiteTitle?: string
  websiteDescription?: string
  contactEmail?: string
  contactPhone?: string
  
  // Navbar Visibility Settings
  showServices?: string
  showPortfolio?: string
  showMarketplace?: string
  showAffiliate?: string
  showBlog?: string
  showContact?: string
  showAbout?: string
}

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

export default function AdminSettingsPage() {
  const { settings: contextSettings, refreshSettings } = useSettings()
  const [settings, setSettings] = useState<SettingsData>({})
  const [aboutData, setAboutData] = useState<AboutData>({
    companyName: { en: 'CV. BikinCode Solution', id: 'CV. BikinCode Solution' },
    description: { en: '', id: '' },
    vision: { en: '', id: '' },
    mission: { en: '', id: '' },
    companyLogo: '',
    stats: { projects: 200, clients: 150, teamMembers: 25, satisfaction: 98 },
    technologies: []
  })
  const [newTechnology, setNewTechnology] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('brand')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    // Initialize settings from context
    const initialSettings = {
      ...contextSettings,
      // Ensure navbar visibility settings have default values
      showServices: contextSettings.showServices || 'true',
      showPortfolio: contextSettings.showPortfolio || 'true',
      showMarketplace: contextSettings.showMarketplace || 'true',
      showAffiliate: contextSettings.showAffiliate || 'true',
      showBlog: contextSettings.showBlog || 'true',
      showContact: contextSettings.showContact || 'true',
      showAbout: contextSettings.showAbout || 'true'
    }
    setSettings(initialSettings)
    console.log('Admin settings initialized:', initialSettings)
    
    // Fetch about data
    fetchAboutData()
    
    setLoading(false)
  }, [contextSettings])

  const fetchAboutData = async () => {
    try {
      const response = await fetch(`/api/about?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setAboutData(data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      // Save regular settings
      if (activeTab !== 'about') {
        const settingsArray = Object.entries(settings).map(([key, value]) => ({
          key,
          value: value || '',
          description: getSettingDescription(key)
        }))

        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: settingsArray })
        })

        if (response.ok) {
          // Refresh the settings context
          await refreshSettings()
          
          // Also refresh the local settings state
          const updatedResponse = await fetch(`/api/settings?t=${Date.now()}`)
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json()
            setSettings(updatedData)
          }
          
          // Dispatch custom event to update navbar
          window.dispatchEvent(new CustomEvent('settingsUpdated'))
          
          // Also dispatch website settings update event
          window.dispatchEvent(new CustomEvent('websiteSettingsUpdated'))
          
          setMessage({ type: 'success', text: 'Settings saved successfully!' })
        } else {
          const errorData = await response.json()
          if (response.status === 403) {
            setMessage({ 
              type: 'error', 
              text: 'Firebase permission denied. Please check your Firebase security rules or contact your administrator.' 
            })
          } else {
            setMessage({ 
              type: 'error', 
              text: errorData.error || 'Failed to save settings. Please try again.' 
            })
          }
        }
      } else {
        // Save about data
        const response = await fetch('/api/about', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aboutData)
        })

        if (response.ok) {
          setMessage({ type: 'success', text: 'About page data saved successfully!' })
        } else {
          const errorData = await response.json()
          if (response.status === 403) {
            setMessage({ 
              type: 'error', 
              text: 'Firebase permission denied. Please check your Firebase security rules.' 
            })
          } else {
            setMessage({ 
              type: 'error', 
              text: errorData.error || 'Failed to save about data. Please try again.' 
            })
          }
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      setMessage({ type: 'error', text: 'Error saving. Please check your connection.' })
    } finally {
      setSaving(false)
    }
  }

  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      companyName: 'Company name displayed in navbar',
      companyLogo: 'Company logo URL',
      brandColor: 'Primary brand color',
      adminName: 'Administrator name',
      adminEmail: 'Administrator email',
      adminAvatar: 'Administrator profile picture URL',
      websiteTitle: 'Website title for SEO',
      websiteDescription: 'Website description for SEO',
      contactEmail: 'Contact email address',
      contactPhone: 'Contact phone number',
      showServices: 'Show Services menu in navbar',
      showPortfolio: 'Show Portfolio menu in navbar',
      showMarketplace: 'Show Marketplace menu in navbar',
      showAffiliate: 'Show Affiliate menu in navbar',
      showBlog: 'Show Blog menu in navbar',
      showContact: 'Show Contact menu in navbar',
      showAbout: 'Show About menu in navbar'
    }
    return descriptions[key] || ''
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (key: string, url: string) => {
    console.log('Image uploaded:', key, url)
    
    // Check if this is for About page logo
    if (key === 'aboutCompanyLogo') {
      setAboutData(prev => ({ ...prev, companyLogo: url }))
      
      // Auto-save about data
      try {
        const response = await fetch('/api/about', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...aboutData, companyLogo: url })
        })

        if (response.ok) {
          setMessage({ type: 'success', text: 'Company logo updated successfully!' })
          setTimeout(() => setMessage(null), 3000)
        }
      } catch (error) {
        console.error('Error auto-saving about logo:', error)
      }
      return
    }
    
    // Update local settings immediately
    setSettings(prev => ({ ...prev, [key]: url }))
    
    // Auto-save the setting to database
    try {
      console.log('Auto-saving setting to database...')
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key, 
          value: url, 
          description: getSettingDescription(key) 
        })
      })

      console.log('Auto-save response:', response.status)

      if (response.ok) {
        console.log('Auto-save successful, refreshing settings...')
        // Refresh the settings context
        await refreshSettings()
        
        // Also refresh the local settings state
        const updatedResponse = await fetch(`/api/settings?t=${Date.now()}`)
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json()
          setSettings(updatedData)
        }
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent('settingsUpdated'))
        
        setMessage({ type: 'success', text: `${key === 'companyLogo' ? 'Company logo' : 'Profile picture'} updated successfully!` })
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      } else {
        console.error('Auto-save failed with status:', response.status)
        const errorData = await response.json()
        console.error('Error data:', errorData)
      }
    } catch (error) {
      console.error('Error auto-saving setting:', error)
      setMessage({ type: 'error', text: 'Image uploaded but failed to save. Please click Save Changes.' })
    }
  }

  const handleAboutInputChange = (field: string, lang: 'en' | 'id', value: string) => {
    setAboutData(prev => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev] as { en: string; id: string },
        [lang]: value
      }
    }))
  }

  const handleAboutStatChange = (stat: string, value: number) => {
    setAboutData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: value
      }
    }))
  }

  const handleAddTechnology = () => {
    if (newTechnology.trim()) {
      setAboutData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }))
      setNewTechnology('')
    }
  }

  const handleRemoveTechnology = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  const tabs = [
    { id: 'brand', label: 'Brand Settings', icon: Building2 },
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'website', label: 'Website Settings', icon: Globe },
    { id: 'navbar', label: 'Navbar Menu', icon: Settings },
    { id: 'about', label: 'About Page', icon: Globe }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-3 h-8 w-8" />
              Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your company and website settings</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/migrate-to-firebase', { method: 'POST' })
                  const result = await response.json()
                  if (result.success) {
                    setMessage({ type: 'success', text: 'Default settings initialized in Firebase!' })
                    // Refresh settings after initialization
                    await refreshSettings()
                    window.dispatchEvent(new CustomEvent('settingsUpdated'))
                  } else {
                    setMessage({ type: 'error', text: result.message || 'Initialization failed' })
                  }
                } catch (error) {
                  setMessage({ type: 'error', text: 'Initialization failed. Please try again.' })
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Initialize Firebase
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        
        {/* Success/Error Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
            {message.text.includes('Firebase permission denied') && (
              <div className="mt-3 text-sm">
                <p className="font-medium">To fix Firebase permissions:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Go to your <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
                  <li>Select your project: <strong>bikincode-d8156</strong></li>
                  <li>Navigate to <strong>Realtime Database → Rules</strong></li>
                  <li>Update rules to allow write access:</li>
                </ol>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{`{
  "rules": {
    "companySettings": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}`}
                </pre>
                <p className="mt-2 text-xs text-green-600">✅ Secure: Public read access, authenticated write access only.</p>
                <p className="mt-2 text-xs text-gray-600">After updating the rules, click "Publish" and try saving again.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Brand Settings */}
        {activeTab === 'brand' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Brand Settings</h3>
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Firebase Realtime Database
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="BikinCode"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">This will appear in the navbar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Color
                  </label>
                  <input
                    type="color"
                    value={settings.brandColor || '#2563eb'}
                    onChange={(e) => handleInputChange('brandColor', e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Primary brand color</p>
                </div>
              </div>

              <div>
                <ImageUpload
                  currentImageUrl={settings.companyLogo}
                  onImageUploaded={(url) => handleImageUpload('companyLogo', url)}
                  uploadPath="company/logos"
                  label="Company Logo"
                  description="Logo image for navbar (recommended: 200x200px)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Firebase Realtime Database
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Administrator Name
                  </label>
                  <input
                    type="text"
                    value={settings.adminName || ''}
                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    value={settings.adminEmail || ''}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    placeholder="admin@bikincode.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  currentImageUrl={settings.adminAvatar}
                  onImageUploaded={(url) => handleImageUpload('adminAvatar', url)}
                  uploadPath="admin/avatars"
                  label="Profile Picture"
                  description="Profile picture for navbar user icon (recommended: 200x200px)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Website Settings */}
        {activeTab === 'website' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Website Settings</h3>
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Firebase Realtime Database
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Title
                </label>
                <input
                  type="text"
                  value={settings.websiteTitle || ''}
                  onChange={(e) => handleInputChange('websiteTitle', e.target.value)}
                  placeholder="BikinCode - Web Development Solutions"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">SEO title for your website</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="hello@bikincode.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">Public contact email address</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone || ''}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+62 822 8188 3489"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">Public contact phone number</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Description
                </label>
                <textarea
                  value={settings.websiteDescription || ''}
                  onChange={(e) => handleInputChange('websiteDescription', e.target.value)}
                  placeholder="Professional web development solutions for modern businesses"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">SEO description for your website</p>
              </div>
            </div>
          </div>
        )}

        {/* Navbar Menu Visibility */}
        {activeTab === 'navbar' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Navbar Menu Visibility</h3>
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Firebase Realtime Database
              </div>
            </div>
            <p className="text-gray-600 mb-6">Control which menu items appear in the navigation bar</p>
            
            <div className="space-y-4">
              {[
                { key: 'showServices', label: 'Services', description: 'Show Services menu and dropdown' },
                { key: 'showPortfolio', label: 'Portfolio', description: 'Show Portfolio menu item' },
                { key: 'showMarketplace', label: 'Marketplace', description: 'Show Marketplace menu item' },
                { key: 'showAffiliate', label: 'Affiliate', description: 'Show Affiliate menu item' },
                { key: 'showBlog', label: 'Blog', description: 'Show Blog menu item' },
                { key: 'showContact', label: 'Contact', description: 'Show Contact menu item' },
                { key: 'showAbout', label: 'About', description: 'Show About menu item' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof SettingsData] === 'true'}
                      onChange={(e) => handleInputChange(item.key, e.target.checked ? 'true' : 'false')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Changes will take effect immediately after saving. Disabled menu items will be hidden from both desktop and mobile navigation.
              </p>
            </div>

            {/* Debug: Show current values */}
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Current Values (Debug):</h4>
                <button
                  onClick={async () => {
                    const response = await fetch(`/api/settings?t=${Date.now()}`)
                    const data = await response.json()
                    console.log('Manual refresh - settings from API:', data)
                    setSettings(prev => ({
                      ...prev,
                      showServices: data.showServices || 'true',
                      showPortfolio: data.showPortfolio || 'true',
                      showMarketplace: data.showMarketplace || 'true',
                      showAffiliate: data.showAffiliate || 'true',
                      showBlog: data.showBlog || 'true',
                      showContact: data.showContact || 'true',
                      showAbout: data.showAbout || 'true'
                    }))
                  }}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Refresh Values
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-1 font-mono">
                <div>showServices: {settings.showServices || 'undefined'}</div>
                <div>showPortfolio: {settings.showPortfolio || 'undefined'}</div>
                <div>showMarketplace: {settings.showMarketplace || 'undefined'}</div>
                <div>showAffiliate: {settings.showAffiliate || 'undefined'}</div>
                <div>showBlog: {settings.showBlog || 'undefined'}</div>
                <div>showContact: {settings.showContact || 'undefined'}</div>
                <div>showAbout: {settings.showAbout || 'undefined'}</div>
              </div>
            </div>
          </div>
        )}

        {/* About Page Settings */}
        {activeTab === 'about' && (
          <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">About Page Content</h3>
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Firebase Realtime Database
            </div>
          </div>

          <div className="space-y-8">
            {/* Company Name */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Company Name</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <input
                    type="text"
                    value={aboutData.companyName.en}
                    onChange={(e) => handleAboutInputChange('companyName', 'en', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indonesian</label>
                  <input
                    type="text"
                    value={aboutData.companyName.id}
                    onChange={(e) => handleAboutInputChange('companyName', 'id', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Company Logo */}
            <div>
              <ImageUpload
                currentImageUrl={aboutData.companyLogo}
                onImageUploaded={(url) => handleImageUpload('aboutCompanyLogo', url)}
                uploadPath="company/about"
                label="Company Logo"
                description="Logo displayed on About page (recommended: 400x400px)"
              />
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Company Description</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <textarea
                    value={aboutData.description.en}
                    onChange={(e) => handleAboutInputChange('description', 'en', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indonesian</label>
                  <textarea
                    value={aboutData.description.id}
                    onChange={(e) => handleAboutInputChange('description', 'id', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Vision */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Vision</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <textarea
                    value={aboutData.vision.en}
                    onChange={(e) => handleAboutInputChange('vision', 'en', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indonesian</label>
                  <textarea
                    value={aboutData.vision.id}
                    onChange={(e) => handleAboutInputChange('vision', 'id', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Mission */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Mission</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <textarea
                    value={aboutData.mission.en}
                    onChange={(e) => handleAboutInputChange('mission', 'en', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indonesian</label>
                  <textarea
                    value={aboutData.mission.id}
                    onChange={(e) => handleAboutInputChange('mission', 'id', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
                  <input
                    type="number"
                    value={aboutData.stats.projects}
                    onChange={(e) => handleAboutStatChange('projects', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clients</label>
                  <input
                    type="number"
                    value={aboutData.stats.clients}
                    onChange={(e) => handleAboutStatChange('clients', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                  <input
                    type="number"
                    value={aboutData.stats.teamMembers}
                    onChange={(e) => handleAboutStatChange('teamMembers', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Satisfaction %</label>
                  <input
                    type="number"
                    value={aboutData.stats.satisfaction}
                    onChange={(e) => handleAboutStatChange('satisfaction', parseInt(e.target.value) || 0)}
                    max={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Technologies</h4>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                    placeholder="Add technology (e.g., React, Node.js)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleAddTechnology}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aboutData.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
                    >
                      <span className="text-gray-700">{tech}</span>
                      <button
                        onClick={() => handleRemoveTechnology(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}