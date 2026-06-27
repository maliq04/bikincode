export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="text-gray-600">Welcome to your employee portal</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <h4 className="font-medium text-gray-900">Request Leave</h4>
                <p className="text-sm text-gray-500">Submit time off request</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <h4 className="font-medium text-gray-900">Submit Expense</h4>
                <p className="text-sm text-gray-500">Report business expenses</p>
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">Engineering</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">Software Developer</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">Jan 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}