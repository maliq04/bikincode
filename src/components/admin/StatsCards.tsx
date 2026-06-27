'use client'

import { useEffect, useState } from 'react'
import { Users, Building2, TrendingUp, DollarSign } from 'lucide-react'

interface Stats {
  totalEmployees: number
  activeEmployees: number
  totalDepartments: number
  employeeGrowth: string
  departmentGrowth: string
  monthlyRevenue: number
  revenueGrowth: string
  growthRate: number
  growthRateChange: string
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-gray-500">Failed to load statistics</div>
  }

  const statsData = [
    {
      name: 'Total Employees',
      value: stats.totalEmployees.toString(),
      change: stats.employeeGrowth,
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Departments',
      value: stats.totalDepartments.toString(),
      change: stats.departmentGrowth,
      changeType: 'positive',
      icon: Building2,
    },
    {
      name: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: stats.revenueGrowth,
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Growth Rate',
      value: `${stats.growthRate}%`,
      change: stats.growthRateChange,
      changeType: 'positive',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <div key={stat.name} className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <stat.icon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {stat.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}