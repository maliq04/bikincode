import { Plus, UserPlus, FileText, Settings } from 'lucide-react'

const actions = [
  {
    name: 'Add Employee',
    description: 'Create a new employee profile',
    icon: UserPlus,
    href: '/admin/employees/new',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    name: 'New Department',
    description: 'Set up a new department',
    icon: Plus,
    href: '/admin/departments/new',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    name: 'Generate Report',
    description: 'Create custom reports',
    icon: FileText,
    href: '/admin/reports/new',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    name: 'System Settings',
    description: 'Configure system preferences',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-gray-500 hover:bg-gray-600'
  }
]

export function QuickActions() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.name}
            className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}