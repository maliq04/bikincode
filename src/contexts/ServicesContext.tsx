'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

interface ServicesContextType {
  services: Service[]
  loading: boolean
  error: string | null
  refreshServices: () => Promise<void>
  getServiceBySlug: (slug: string) => Service | undefined
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined)

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/services?t=${Date.now()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch services')
      }
      
      const data = await response.json()
      // Filter only active services for public display
      const activeServices = data.filter((s: Service) => s.status === 'active' || !s.status)
      setServices(activeServices)
    } catch (err: any) {
      console.error('Error fetching services:', err)
      setError(err.message)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()

    // Listen for services updates
    const handleServicesUpdate = () => {
      console.log('Services update event received, refreshing...')
      setTimeout(fetchServices, 100)
    }

    window.addEventListener('servicesUpdated', handleServicesUpdate)

    return () => {
      window.removeEventListener('servicesUpdated', handleServicesUpdate)
    }
  }, [])

  const refreshServices = async () => {
    await fetchServices()
  }

  const getServiceBySlug = (slug: string) => {
    return services.find(s => s.slug === slug)
  }

  return (
    <ServicesContext.Provider value={{ 
      services, 
      loading, 
      error, 
      refreshServices,
      getServiceBySlug
    }}>
      {children}
    </ServicesContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServicesContext)
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider')
  }
  return context
}
