'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Settings,
  LogOut,
  Briefcase,
  FolderOpen,
  BookOpen
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Employees', href: '/admin/employees', icon: Users },
  { name: 'Departments', href: '/admin/departments', icon: Building2 },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white shadow-sm">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Building2 className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">BikinCode</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  )
}