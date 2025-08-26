export default function SavedProjectsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Projects</h1>
        <p className="mt-2 text-gray-600">Your saved and archived projects</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Project Alpha {i}</h3>
            <p className="text-gray-600 text-sm mb-4">Saved on March {10 + i}, 2024</p>
            <div className="flex justify-between items-center">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                In Progress
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}