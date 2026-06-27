'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Users, DollarSign, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Department {
  id: string
  name: string
  description?: string
  budget: number
  manager?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  _count: {
    employees: number
  }
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data.departments)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">Manage company departments and budgets</p>
        </div>
        <Link href="/admin/departments/new" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-6"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <div key={department.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                <div className="flex space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-error-600 hover:text-error-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {department.description && (
                <p className="text-gray-600 text-sm mb-4">{department.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Employees
                  </div>
                  <span className="font-medium">{department._count.employees}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Budget
                  </div>
                  <span className="font-medium">{formatCurrency(department.budget)}</span>
                </div>

                {department.manager && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Manager</p>
                    <p className="font-medium text-sm">
                      {department.manager.firstName} {department.manager.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{department.manager.email}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && departments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first department.</p>
          <Link href="/admin/departments/new" className="btn-primary">
            Add Department
          </Link>
        </div>
      )}
    </div>
  )
}