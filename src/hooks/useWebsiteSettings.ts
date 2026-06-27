'use client'

import { useState, useEffect } from 'react'

interface WebsiteSettings {
  websiteTitle: string
  websiteDescription: string
  contactEmail: string
  contactPhone: string
}

export function useWebsiteSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    websiteTitle: 'BikinCode - Web Development Solutions',
    websiteDescription: 'Professional web development solutions for modern businesses',
    contactEmail: 'hello@bikincode.com',
    contactPhone: '+62 813 6124 9456'
  })
  const [isLoaded, setIsLoaded] = useState(false)

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/firebase-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching website settings:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    fetchSettings()

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      fetchSettings()
    }

    window.addEventListener('websiteSettingsUpdated', handleSettingsUpdate)

    return () => {
      window.removeEventListener('websiteSettingsUpdated', handleSettingsUpdate)
    }
  }, [])

  return { settings, isLoaded, refreshSettings: fetchSettings }
}