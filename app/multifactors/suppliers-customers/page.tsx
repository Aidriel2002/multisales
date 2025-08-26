export default function SuppliersCustomersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Suppliers & Customers</h1>
        <p className="mt-2 text-gray-600">Manage your business relationships</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Suppliers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['TechCorp Solutions', 'Global Supply Co.', 'Industrial Partners Ltd.'].map((supplier) => (
                <div key={supplier} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h3 className="font-medium">{supplier}</h3>
                    <p className="text-sm text-gray-500">Active since 2023</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Customers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['Acme Corporation', 'Beta Industries', 'Gamma Enterprises'].map((customer) => (
                <div key={customer} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h3 className="font-medium">{customer}</h3>
                    <p className="text-sm text-gray-500">Customer since 2022</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Premium
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}