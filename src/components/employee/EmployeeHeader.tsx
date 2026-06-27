'use client'

import { Bell, User } from 'lucide-react'

export function EmployeeHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-900">Good morning, John!</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-900">John Smith</div>
              <div className="text-xs text-gray-500">Software Developer</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}