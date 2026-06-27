export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  position: string
  department: string
  startDate: string
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
}

export interface Department {
  id: string
  name: string
  description: string
  managerId: string
  employeeCount: number
  budget: number
  createdAt: string
}

export interface Activity {
  id: string
  userId: string
  action: string
  timestamp: string
  type: 'user' | 'document' | 'process' | 'request' | 'expense'
  metadata?: Record<string, any>
}

export interface Stats {
  totalEmployees: number
  totalDepartments: number
  monthlyRevenue: number
  growthRate: number
}