export default function AccountApprovalPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Approval</h1>
        <p className="mt-2 text-gray-600">Review and approve pending account requests</p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              5 pending
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {[
            { name: 'John Smith', email: 'john.smith@company.com', role: 'Supplier', date: '2024-03-20' },
            { name: 'Sarah Johnson', email: 'sarah.j@enterprise.com', role: 'Customer', date: '2024-03-19' },
            { name: 'Mike Chen', email: 'mike.chen@tech.co', role: 'Supplier', date: '2024-03-18' },
            { name: 'Lisa Wong', email: 'lisa.wong@business.net', role: 'Customer', date: '2024-03-17' },
            { name: 'David Brown', email: 'david.b@solutions.com', role: 'Supplier', date: '2024-03-16' }
          ].map((request, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{request.name}</h3>
                  <p className="text-sm text-gray-600">{request.email}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-xs text-gray-500">Role: {request.role}</span>
                    <span className="text-xs text-gray-500">Requested: {request.date}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}