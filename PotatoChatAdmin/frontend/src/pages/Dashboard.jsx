import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Server, 
  Smartphone, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Globe,
  Zap,
  Shield,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState(null);

  // 模拟仪表板数据
  const mockDashboardData = {
    overview: {
      totalUsers: 125430,
      activeUsers: 89250,
      totalRevenue: 2847500,
      totalTrades: 45680,
      apiCalls: 1250000,
      pendingApps: 12,
      userGrowthRate: 15.2,
      revenueGrowthRate: 23.8,
      tradeGrowthRate: 18.5,
      systemUptime: 99.9
    },
    userGrowth: [
      { date: '12-23', users: 118500, active: 82300 },
      { date: '12-24', users: 119800, active: 83100 },
      { date: '12-25', users: 121200, active: 84200 },
      { date: '12-26', users: 122800, active: 85800 },
      { date: '12-27', users: 124100, active: 87200 },
      { date: '12-28', users: 124900, active: 88500 },
      { date: '12-29', users: 125430, active: 89250 }
    ],
    revenueData: [
      { date: '12-23', subscription: 45000, trading: 32000, ads: 18000, other: 8000 },
      { date: '12-24', subscription: 47000, trading: 35000, ads: 19000, other: 9000 },
      { date: '12-25', subscription: 48000, trading: 38000, ads: 20000, other: 10000 },
      { date: '12-26', subscription: 50000, trading: 42000, ads: 22000, other: 11000 },
      { date: '12-27', subscription: 52000, trading: 45000, ads: 24000, other: 12000 },
      { date: '12-28', subscription: 54000, trading: 48000, ads: 25000, other: 13000 },
      { date: '12-29', subscription: 56000, trading: 52000, ads: 26000, other: 14000 }
    ],
    tradingVolume: [
      { time: '00:00', volume: 1200000 },
      { time: '04:00', volume: 800000 },
      { time: '08:00', volume: 2100000 },
      { time: '12:00', volume: 3200000 },
      { time: '16:00', volume: 2800000 },
      { time: '20:00', volume: 1900000 }
    ],
    revenueDistribution: [
      { name: '订阅服务', value: 35, amount: 996250, color: '#3B82F6' },
      { name: '交易手续费', value: 28, amount: 797300, color: '#10B981' },
      { name: '广告收入', value: 18, amount: 512550, color: '#F59E0B' },
      { name: 'AI策略', value: 12, amount: 341700, color: '#8B5CF6' },
      { name: '数据服务', value: 4, amount: 113900, color: '#EF4444' },
      { name: '虚拟商品', value: 3, amount: 85425, color: '#6B7280' }
    ],
    topTradingPairs: [
      { symbol: 'BTC/USDT', volume: 12500000, trades: 8950, change: 2.3 },
      { symbol: 'ETH/USDT', volume: 8900000, trades: 6780, change: -1.2 },
      { symbol: 'BNB/USDT', volume: 4200000, trades: 3450, change: 4.1 },
      { symbol: 'ADA/USDT', volume: 2800000, trades: 2890, change: -0.8 },
      { symbol: 'SOL/USDT', volume: 2100000, trades: 1950, change: 6.7 }
    ],
    systemMetrics: {
      apiUptime: 99.9,
      avgResponseTime: 145,
      errorRate: 0.02,
      activeConnections: 15420
    },
    recentActivities: [
      { id: 1, type: 'user_register', message: '新用户注册：alice_trader', time: '2分钟前' },
      { id: 2, type: 'large_trade', message: '大额交易：BTC/USDT $500,000', time: '5分钟前' },
      { id: 3, type: 'app_submitted', message: '新应用提交：CryptoWallet Pro', time: '8分钟前' },
      { id: 4, type: 'api_error', message: 'API错误率超过阈值', time: '12分钟前' },
      { id: 5, type: 'subscription', message: '企业版订阅：TechCorp Inc', time: '15分钟前' }
    ]
  };

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { overview, userGrowth, revenueData, tradingVolume, revenueDistribution, topTradingPairs, systemMetrics, recentActivities } = dashboardData;

  return (
    <div className="space-y-6">
      {/* 页面标题和控制 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据仪表板</h1>
          <p className="text-gray-600">实时监控平台关键指标和业务数据</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">今天</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总用户数</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(overview.totalUsers)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{overview.userGrowthRate}%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总收入</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(overview.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{overview.revenueGrowthRate}%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">交易笔数</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(overview.totalTrades)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{overview.tradeGrowthRate}%</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">系统可用性</p>
              <p className="text-2xl font-bold text-gray-900">{overview.systemUptime}%</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">正常运行</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Server className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用户增长趋势 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">用户增长趋势</h3>
            <LineChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="总用户"
              />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="#10B981" 
                strokeWidth={2}
                name="活跃用户"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 收入分布 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">收入分布</h3>
            <PieChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 收入趋势 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">收入趋势</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="subscription" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                name="订阅服务"
              />
              <Area 
                type="monotone" 
                dataKey="trading" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981"
                name="交易手续费"
              />
              <Area 
                type="monotone" 
                dataKey="ads" 
                stackId="1"
                stroke="#F59E0B" 
                fill="#F59E0B"
                name="广告收入"
              />
              <Area 
                type="monotone" 
                dataKey="other" 
                stackId="1"
                stroke="#8B5CF6" 
                fill="#8B5CF6"
                name="其他"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 交易量分布 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">24小时交易量</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tradingVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="volume" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 详细数据表格和活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 热门交易对 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">热门交易对</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">交易对</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">24h交易量</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">交易笔数</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">24h涨跌</th>
                </tr>
              </thead>
              <tbody>
                {topTradingPairs.map((pair, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{pair.symbol}</div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(pair.volume)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatNumber(pair.trades)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${pair.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {pair.change >= 0 ? '+' : ''}{pair.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'user_register' && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  {activity.type === 'large_trade' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  {activity.type === 'app_submitted' && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                    </div>
                  )}
                  {activity.type === 'api_error' && (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                  )}
                  {activity.type === 'subscription' && (
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 系统指标 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">系统性能指标</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{systemMetrics.apiUptime}%</div>
            <div className="text-sm text-gray-600">API可用性</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{systemMetrics.avgResponseTime}ms</div>
            <div className="text-sm text-gray-600">平均响应时间</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{systemMetrics.errorRate}%</div>
            <div className="text-sm text-gray-600">错误率</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(systemMetrics.activeConnections)}</div>
            <div className="text-sm text-gray-600">活跃连接</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

