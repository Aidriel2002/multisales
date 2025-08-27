/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import Image from "next/image"
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase/client'
import { 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  UserCheck,
  UserX,
  ChevronDown,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Eye
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  address: string
  avatar_url: string
  role: 'staff' | 'admin'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  last_active: string
}

type SortField = 'name' | 'email' | 'role' | 'status' | 'created_at' | 'last_active'
type SortDirection = 'asc' | 'desc'

export default function UserRoleManagement() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Fetch users from auth and profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedUsers: UserProfile[] = profiles?.map((profile: any) => ({
  id: profile.id,
  email: profile.email || '', 
  first_name: profile.first_name || '',
  last_name: profile.last_name || '',
  phone: profile.phone || '',
  address: profile.address || '',
  avatar_url: profile.avatar_url || '',
  role: profile.role || 'staff',
  status: profile.status || 'pending',
  created_at: profile.created_at,
  updated_at: profile.updated_at,
  last_active: profile.last_active || null, 
  
})) || []


      setUsers(formattedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      setUpdating(userId)
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status, updated_at: new Date().toISOString() }
          : user
      ))

      // Send email notification (you can implement this)
      await sendStatusUpdateNotification(userId, status)
      
    } catch (error) {
      console.error('Error updating user status:', error)
    } finally {
      setUpdating(null)
    }
  }

  const updateUserRole = async (userId: string, role: UserProfile['role']) => {
    try {
      setUpdating(userId)
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role, updated_at: new Date().toISOString() }
          : user
      ))
      
    } catch (error) {
      console.error('Error updating user role:', error)
    } finally {
      setUpdating(null)
    }
  }


  const sendStatusUpdateNotification = async (userId: string, status: string) => {
    // Implement email notification logic here
    console.log(`Sending ${status} notification to user ${userId}`)
  }

  const filteredAndSortedUsers = users
  .filter(user => {
    const matchesSearch = 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })
  .sort((a, b) => {
    let aValue: any
    let bValue: any
    
    // Handle the special case for 'name' sorting
    if (sortField === 'name') {
      aValue = `${a.first_name} ${a.last_name}`.trim()
      bValue = `${b.first_name} ${b.last_name}`.trim()
    } else {
      // For other fields, access them directly from the user object
      aValue = a[sortField]
      bValue = b[sortField]
    }
    
    // Convert to lowercase for string comparison
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
    }
    if (typeof bValue === 'string') {
      bValue = bValue.toLowerCase()
    }
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1
    
    // Perform comparison
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-indigo-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-gray-600 mt-1">Manage user roles and approval status</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  Total: {users.length}
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Pending: {users.filter(u => u.status === 'pending').length}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  Approved: {users.filter(u => u.status === 'approved').length}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-')
                  setSortField(field as SortField)
                  setSortDirection(direction as SortDirection)
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="email-asc">Email A-Z</option>
                <option value="email-desc">Email Z-A</option>
                <option value="last_active-desc">Last Active</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {user.avatar_url ? (
                            <Image
                              src={user.avatar_url}
                              alt={`${user.first_name} ${user.last_name}`}
                              width={40}   
                              height={40}  
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', '/')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {user.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {user.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.last_active ? formatDate(user.last_active) : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {user.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateUserStatus(user.id, 'approved')}
                              disabled={updating === user.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateUserStatus(user.id, 'rejected')}
                              disabled={updating === user.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject User"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as UserProfile['role'])}
                          disabled={updating === user.id}
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  {selectedUser.avatar_url ? (
                    <Image
                      src={selectedUser.avatar_url}
                      alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                      width={64}   
                      height={64}  
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </h3>
                    <p className="text-gray-500">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role.replace('_', '/')}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600">{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.address && (
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                          <span className="text-sm text-gray-600">{selectedUser.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-xs text-gray-500">Joined</div>
                          <div className="text-sm text-gray-600">{formatDate(selectedUser.created_at)}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-xs text-gray-500">Last Active</div>
                          <div className="text-sm text-gray-600">
                            {selectedUser.last_active ? formatDate(selectedUser.last_active) : 'Never'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}