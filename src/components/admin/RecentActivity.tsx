'use client'

import { useEffect, useState } from 'react'
import { Clock, User, FileText, Building2, AlertCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Activity {
  id: string
  type: string
  title: string
  description: string
  user: string | null
  createdBy: string
  createdAt: string
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'USER_CREATED':
    case 'USER_UPDATED':
      return User
    case 'DEPARTMENT_CREATED':
    case 'DEPARTMENT_UPDATED':
      return Building2
    case 'LEAVE_REQUESTED':
    case 'EXPENSE_SUBMITTED':
      return FileText
    default:
      return AlertCircle
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'USER_CREATED':
      return 'bg-success-100 text-success-600'
    case 'USER_UPDATED':
      return 'bg-primary-100 text-primary-600'
    case 'DEPARTMENT_CREATED':
      return 'bg-purple-100 text-purple-600'
    case 'LEAVE_REQUESTED':
      return 'bg-warning-100 text-warning-600'
    case 'EXPENSE_SUBMITTED':
      return 'bg-orange-100 text-orange-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setActivities(data.recentActivities || [])
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No recent activities
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const colorClass = getActivityColor(activity.type)
            
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.createdBy}</span>{' '}
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}