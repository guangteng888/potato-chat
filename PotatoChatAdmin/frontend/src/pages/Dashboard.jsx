import { useState, useEffect } from 'react'
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 12543,
    activeUsers: 8921,
    totalMessages: 45231,
    totalTrades: 1234,
    totalVolume: 2345678,
    systemStatus: 'healthy'
  })

  const [chartData] = useState([
    { name: '周一', users: 4000, messages: 2400, trades: 240 },
    { name: '周二', users: 3000, messages: 1398, trades: 221 },
    { name: '周三', users: 2000, messages: 9800, trades: 229 },
    { name: '周四', users: 2780, messages: 3908, trades: 200 },
    { name: '周五', users: 1890, messages: 4800, trades: 218 },
    { name: '周六', users: 2390, messages: 3800, trades: 250 },
    { name: '周日', users: 3490, messages: 4300, trades: 210 },
  ])

  const [pieData] = useState([
    { name: '桌面端', value: 45, color: '#FF6B35' },
    { name: 'Web端', value: 30, color: '#4CAF50' },
    { name: 'Android', value: 20, color: '#2196F3' },
    { name: 'iOS', value: 5, color: '#9C27B0' },
  ])

  const [recentActivities] = useState([
    { id: 1, type: 'user', message: '新用户注册：张三', time: '2分钟前', status: 'success' },
    { id: 2, type: 'trade', message: '大额交易警告：$50,000', time: '5分钟前', status: 'warning' },
    { id: 3, type: 'system', message: '系统维护完成', time: '10分钟前', status: 'info' },
    { id: 4, type: 'security', message: '检测到异常登录', time: '15分钟前', status: 'error' },
    { id: 5, type: 'user', message: '用户等级提升：李四', time: '20分钟前', status: 'success' },
  ])

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const isPositive = change > 0
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500'
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">较昨日</span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    )
  }

  const ActivityItem = ({ activity }) => {
    const statusColors = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    }

    const statusIcons = {
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertTriangle,
      info: Activity
    }

    const StatusIcon = statusIcons[activity.status]

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className={`p-2 rounded-full ${statusColors[activity.status]}`}>
          <StatusIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.message}
          </p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600">欢迎回来，这里是您的平台概览</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500" />
            <span>系统运行正常</span>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总用户数"
          value={stats.totalUsers.toLocaleString()}
          change={12.5}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="活跃用户"
          value={stats.activeUsers.toLocaleString()}
          change={8.2}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="消息总数"
          value={stats.totalMessages.toLocaleString()}
          change={15.3}
          icon={MessageSquare}
          color="orange"
        />
        <StatCard
          title="交易金额"
          value={`$${(stats.totalVolume / 1000000).toFixed(1)}M`}
          change={-2.1}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用户活跃度趋势 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">用户活跃度趋势</h3>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
              <option>最近7天</option>
              <option>最近30天</option>
              <option>最近90天</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#FF6B35" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 平台使用分布 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">平台使用分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 消息和交易统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 消息统计 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">消息统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近活动</h3>
            <button className="text-sm text-orange-600 hover:text-orange-700">
              查看全部
            </button>
          </div>
          <div className="space-y-1">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

