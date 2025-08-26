'use client'

import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderOpen, 
  BookmarkCheck, 
  Users, 
  UserCheck, 
  Wifi, 
  Home 
} from 'lucide-react'

const menuItems = [
  {
    name: 'Dashboard',
    href: '/multifactors/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Projects',
    href: '/multifactors/projects',
    icon: FolderOpen
  },
  {
    name: 'Saved Projects',
    href: '/multifactors/saved-projects',
    icon: BookmarkCheck
  },
  {
    name: 'Suppliers & Customers',
    href: '/multifactors/suppliers-customers',
    icon: Users
  },
  {
    name: 'Account Approval',
    href: '/multifactors/account-approval',
    icon: UserCheck
  }
]

const integrationItems = [
  {
    name: 'Ruijie Reyee',
    href: '/ruijie/dashboard',
    icon: Wifi,
    isExternal: true
  },
  {
    name: 'Tuya',
    href: '/tuya/dashboard',
    icon: Home,
    isExternal: true
  }
]

export default function MultiSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="w-64 bg-white shadow-lg h-full border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Multi-Factors</h1>
        <p className="text-sm text-gray-500 mt-1">Main Dashboard</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Main Menu
          </h2>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="px-4 mt-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Integrations
          </h2>
          <ul className="space-y-2">
            {integrationItems.map((item) => {
              const Icon = item.icon
              
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                    <span className="ml-auto text-xs text-gray-400">→</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </div>
  )
}