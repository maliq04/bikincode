import { EmployeeSidebar } from '@/components/employee/EmployeeSidebar'
import { EmployeeHeader } from '@/components/employee/EmployeeHeader'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EmployeeHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}