'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SettingsContextType {
  settings: Record<string, string>
  updateSettings: (newSettings: Record<string, string>) => void
  getSetting: (key: string, defaultValue?: string) => string
  isLoaded: boolean
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetchSettings()

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      console.log('Settings update event received, refreshing context...')
      fetchSettings()
    }

    window.addEventListener('settingsUpdated', handleSettingsUpdate)
    window.addEventListener('websiteSettingsUpdated', handleSettingsUpdate)

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate)
      window.removeEventListener('websiteSettingsUpdated', handleSettingsUpdate)
    }
  }, [])

  const fetchSettings = async () => {
    try {
      // Add cache busting parameter
      const response = await fetch(`/api/settings?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        console.log('SettingsContext: Fetched settings:', data)
        setSettings(data)
      } else {
        console.warn('Failed to fetch settings, using defaults')
        // Set default values if API fails
        setSettings({
          companyName: 'BikinCode',
          companyLogo: '',
          adminAvatar: ''
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Set default values if API fails
      setSettings({
        companyName: 'BikinCode',
        companyLogo: '',
        adminAvatar: ''
      })
    } finally {
      setIsLoaded(true)
    }
  }

  const refreshSettings = async () => {
    await fetchSettings()
  }

  const updateSettings = (newSettings: Record<string, string>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const getSetting = (key: string, defaultValue: string = ''): string => {
    return settings[key] || defaultValue
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, getSetting, isLoaded, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}