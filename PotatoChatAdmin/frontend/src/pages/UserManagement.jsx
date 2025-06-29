import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Ban, 
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Upload
} from 'lucide-react'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // 模拟用户数据
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        username: 'zhangsan',
        email: 'zhangsan@example.com',
        name: '张三',
        phone: '13800138001',
        status: 'active',
        level: 'VIP',
        balance: 12500.50,
        registerDate: '2024-01-15',
        lastLogin: '2024-06-28 14:30',
        avatar: '👨'
      },
      {
        id: 2,
        username: 'lisi',
        email: 'lisi@example.com',
        name: '李四',
        phone: '13800138002',
        status: 'inactive',
        level: '普通',
        balance: 3200.00,
        registerDate: '2024-02-20',
        lastLogin: '2024-06-25 09:15',
        avatar: '👩'
      },
      {
        id: 3,
        username: 'wangwu',
        email: 'wangwu@example.com',
        name: '王五',
        phone: '13800138003',
        status: 'banned',
        level: '高级',
        balance: 8900.75,
        registerDate: '2024-03-10',
        lastLogin: '2024-06-20 16:45',
        avatar: '🧑'
      },
      {
        id: 4,
        username: 'zhaoliu',
        email: 'zhaoliu@example.com',
        name: '赵六',
        phone: '13800138004',
        status: 'active',
        level: 'VIP',
        balance: 25600.25,
        registerDate: '2024-01-05',
        lastLogin: '2024-06-29 11:20',
        avatar: '👨‍💼'
      },
      {
        id: 5,
        username: 'sunqi',
        email: 'sunqi@example.com',
        name: '孙七',
        phone: '13800138005',
        status: 'active',
        level: '普通',
        balance: 1500.00,
        registerDate: '2024-04-12',
        lastLogin: '2024-06-28 20:10',
        avatar: '👩‍💻'
      }
    ]
    
    setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const handleDeleteUser = (userId) => {
    if (confirm('确定要删除这个用户吗？')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: '活跃', color: 'bg-green-100 text-green-800' },
      inactive: { label: '非活跃', color: 'bg-gray-100 text-gray-800' },
      banned: { label: '已封禁', color: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status] || statusConfig.inactive
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getLevelBadge = (level) => {
    const levelConfig = {
      'VIP': { color: 'bg-purple-100 text-purple-800' },
      '高级': { color: 'bg-blue-100 text-blue-800' },
      '普通': { color: 'bg-gray-100 text-gray-800' }
    }
    const config = levelConfig[level] || levelConfig['普通']
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {level}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600">管理平台用户账户和权限</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            导出
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Upload className="w-4 h-4 mr-2" />
            导入
          </button>
          <button 
            onClick={() => setShowUserModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加用户
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户名、姓名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
                <option value="banned">已封禁</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                已选择 {selectedUsers.length} 个用户
              </span>
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                  批量激活
                </button>
                <button className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                  批量封禁
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  等级
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  余额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注册时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最后登录
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-4"
                      />
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{user.avatar}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getLevelBadge(user.level)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{user.balance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.registerDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'banned')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">没有找到匹配的用户</div>
          </div>
        )}
      </div>

      {/* 分页 */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            上一页
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            下一页
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              显示第 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredUsers.length}</span> 条，
              共 <span className="font-medium">{filteredUsers.length}</span> 条记录
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                上一页
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                下一页
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement

