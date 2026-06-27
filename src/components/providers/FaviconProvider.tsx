'use client'

import { useEffect } from 'react'
import { useSettings } from '@/contexts/SettingsContext'

export function FaviconProvider() {
  const { settings } = useSettings()

  useEffect(() => {
    const logoUrl = settings?.companyLogo
    if (!logoUrl) return

    // Find existing favicon or create one
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.type = 'image/png'
    link.href = logoUrl
  }, [settings?.companyLogo])

  return null
}
