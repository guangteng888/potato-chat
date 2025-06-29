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
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Settings, 
  Eye, 
  Edit, 
  Plus, 
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  CreditCard,
  Smartphone,
  Monitor,
  Zap,
  Star,
  Gift,
  Briefcase,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const BusinessManagement = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [businessData, setBusinessData] = useState(null);

  // 模拟商业数据
  const mockBusinessData = {
    overview: {
      totalRevenue: 2847500,
      monthlyGrowth: 23.8,
      activeSubscribers: 15420,
      conversionRate: 12.5,
      averageRevenuePerUser: 184.5,
      customerLifetimeValue: 2250
    },
    revenueStreams: [
      {
        id: 'subscription',
        name: '订阅服务',
        revenue: 996250,
        percentage: 35,
        growth: 18.5,
        subscribers: 15420,
        plans: [
          { name: '基础版', price: 9.99, subscribers: 8500, revenue: 84915 },
          { name: '专业版', price: 29.99, subscribers: 5200, revenue: 155948 },
          { name: '企业版', price: 99.99, subscribers: 1720, revenue: 171983 }
        ]
      },
      {
        id: 'trading_fees',
        name: '交易手续费',
        revenue: 797300,
        percentage: 28,
        growth: 25.2,
        transactions: 45680,
        avgFeeRate: 0.15
      },
      {
        id: 'advertising',
        name: '广告收入',
        revenue: 512550,
        percentage: 18,
        growth: 15.8,
        impressions: 12500000,
        cpm: 4.1
      },
      {
        id: 'ai_strategies',
        name: 'AI策略服务',
        revenue: 341700,
        percentage: 12,
        growth: 45.2,
        activeStrategies: 2850,
        avgPrice: 119.99
      },
      {
        id: 'data_services',
        name: '数据服务',
        revenue: 113900,
        percentage: 4,
        growth: 32.1,
        apiCalls: 5600000,
        avgRevenue: 0.02
      },
      {
        id: 'virtual_goods',
        name: '虚拟商品',
        revenue: 85425,
        percentage: 3,
        growth: 28.7,
        purchases: 18950,
        avgOrderValue: 4.51
      }
    ],
    revenueHistory: [
      { month: '07月', subscription: 750000, trading: 580000, ads: 420000, ai: 180000, data: 85000, virtual: 65000 },
      { month: '08月', subscription: 820000, trading: 620000, ads: 450000, ai: 210000, data: 92000, virtual: 68000 },
      { month: '09月', subscription: 880000, trading: 680000, ads: 470000, ai: 245000, data: 98000, virtual: 72000 },
      { month: '10月', subscription: 920000, trading: 720000, ads: 485000, ai: 280000, data: 105000, virtual: 76000 },
      { month: '11月', subscription: 960000, trading: 760000, ads: 495000, ai: 315000, data: 108000, virtual: 80000 },
      { month: '12月', subscription: 996250, trading: 797300, ads: 512550, ai: 341700, data: 113900, virtual: 85425 }
    ],
    subscriptionMetrics: {
      newSubscribers: 1250,
      churnRate: 3.2,
      upgradeRate: 8.5,
      downgradeRate: 2.1,
      netRevenueRetention: 115,
      monthlyRecurringRevenue: 996250
    },
    tradingMetrics: {
      totalVolume: 125000000,
      avgTradeSize: 2738,
      feeRevenue: 797300,
      topTraders: 850,
      vipUsers: 320
    },
    advertisingMetrics: {
      totalImpressions: 12500000,
      clickThroughRate: 2.8,
      costPerMille: 4.1,
      activeAdvertisers: 125,
      fillRate: 94.5
    },
    customerSegments: [
      { segment: '个人投资者', users: 89250, revenue: 1580000, avgSpend: 177 },
      { segment: '专业交易者', users: 8950, revenue: 895000, avgSpend: 1000 },
      { segment: '机构客户', users: 450, revenue: 372500, avgSpend: 8278 }
    ],
    conversionFunnel: [
      { stage: '访问者', count: 125000, rate: 100 },
      { stage: '注册用户', count: 25000, rate: 20 },
      { stage: '激活用户', count: 18750, rate: 15 },
      { stage: '付费用户', count: 15625, rate: 12.5 },
      { stage: '忠实用户', count: 9375, rate: 7.5 }
    ]
  };

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setBusinessData(mockBusinessData);
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

  const renderOverview = () => {
    const { overview, revenueStreams, revenueHistory } = businessData;

    return (
      <div className="space-y-6">
        {/* 关键指标 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总收入</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(overview.totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{overview.monthlyGrowth}%</span>
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
                <p className="text-sm text-gray-600">活跃订阅者</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(overview.activeSubscribers)}</p>
                <div className="flex items-center mt-2">
                  <Users className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">订阅用户</span>
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
                <p className="text-sm text-gray-600">转化率</p>
                <p className="text-2xl font-bold text-gray-900">{overview.conversionRate}%</p>
                <div className="flex items-center mt-2">
                  <Target className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600">访客转付费</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 收入流分布 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">收入流分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueStreams}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {revenueStreams.map((entry, index) => {
                    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280'];
                    return <Cell key={`cell-${index}`} fill={colors[index]} />;
                  })}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">收入趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 收入流详情 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">收入流详情</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {revenueStreams.map((stream, index) => {
              const icons = [CreditCard, TrendingUp, Monitor, Zap, BarChart3, Gift];
              const Icon = icons[index];
              const colors = ['blue', 'green', 'yellow', 'purple', 'red', 'gray'];
              const color = colors[index];

              return (
                <div key={stream.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 bg-${color}-100 rounded-lg`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <span className={`text-sm font-medium ${stream.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stream.growth >= 0 ? '+' : ''}{stream.growth}%
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{stream.name}</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stream.revenue)}</p>
                  <p className="text-sm text-gray-600">{stream.percentage}% 总收入</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSubscriptions = () => {
    const { subscriptionMetrics, revenueStreams } = businessData;
    const subscriptionData = revenueStreams.find(s => s.id === 'subscription');

    return (
      <div className="space-y-6">
        {/* 订阅指标 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">月度经常性收入</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(subscriptionMetrics.monthlyRecurringRevenue)}</p>
                <p className="text-sm text-gray-600 mt-1">MRR</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">流失率</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionMetrics.churnRate}%</p>
                <p className="text-sm text-gray-600 mt-1">月度流失</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">净收入留存</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionMetrics.netRevenueRetention}%</p>
                <p className="text-sm text-gray-600 mt-1">NRR</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 订阅计划详情 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">订阅计划表现</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">计划</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">价格</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">订阅者</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">月收入</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">占比</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionData.plans.map((plan, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{plan.name}</div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      ${plan.price}/月
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatNumber(plan.subscribers)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(plan.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {((plan.revenue / subscriptionData.revenue) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 订阅指标详情 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">用户行为指标</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">新增订阅者</span>
                <span className="font-semibold text-gray-900">{formatNumber(subscriptionMetrics.newSubscribers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">升级率</span>
                <span className="font-semibold text-green-600">{subscriptionMetrics.upgradeRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">降级率</span>
                <span className="font-semibold text-yellow-600">{subscriptionMetrics.downgradeRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">流失率</span>
                <span className="font-semibold text-red-600">{subscriptionMetrics.churnRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">收入指标</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">月度经常性收入</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subscriptionMetrics.monthlyRecurringRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">平均每用户收入</span>
                <span className="font-semibold text-gray-900">${(subscriptionMetrics.monthlyRecurringRevenue / subscriptionData.subscribers).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">净收入留存率</span>
                <span className="font-semibold text-blue-600">{subscriptionMetrics.netRevenueRetention}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrading = () => {
    const { tradingMetrics, revenueStreams } = businessData;
    const tradingData = revenueStreams.find(s => s.id === 'trading_fees');

    return (
      <div className="space-y-6">
        {/* 交易指标 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总交易量</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(tradingMetrics.totalVolume)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">手续费收入</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(tradingMetrics.feeRevenue)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均交易额</p>
                <p className="text-2xl font-bold text-gray-900">${tradingMetrics.avgTradeSize}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VIP用户</p>
                <p className="text-2xl font-bold text-gray-900">{tradingMetrics.vipUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 手续费设置 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">手续费设置</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              调整费率
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">用户等级</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">现货费率</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">期货费率</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">用户数量</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">月收入贡献</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">普通用户</td>
                  <td className="py-3 px-4 text-right">0.2%</td>
                  <td className="py-3 px-4 text-right">0.15%</td>
                  <td className="py-3 px-4 text-right">85,420</td>
                  <td className="py-3 px-4 text-right">$425,000</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">VIP1</td>
                  <td className="py-3 px-4 text-right">0.15%</td>
                  <td className="py-3 px-4 text-right">0.12%</td>
                  <td className="py-3 px-4 text-right">8,950</td>
                  <td className="py-3 px-4 text-right">$185,000</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">VIP2</td>
                  <td className="py-3 px-4 text-right">0.12%</td>
                  <td className="py-3 px-4 text-right">0.10%</td>
                  <td className="py-3 px-4 text-right">2,850</td>
                  <td className="py-3 px-4 text-right">$125,000</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">VIP3</td>
                  <td className="py-3 px-4 text-right">0.10%</td>
                  <td className="py-3 px-4 text-right">0.08%</td>
                  <td className="py-3 px-4 text-right">950</td>
                  <td className="py-3 px-4 text-right">$62,300</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const { customerSegments, conversionFunnel } = businessData;

    return (
      <div className="space-y-6">
        {/* 客户细分 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">客户细分分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerSegments.map((segment, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{segment.segment}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">用户数量</span>
                    <span className="font-semibold">{formatNumber(segment.users)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">总收入</span>
                    <span className="font-semibold">{formatCurrency(segment.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均消费</span>
                    <span className="font-semibold">${segment.avgSpend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 转化漏斗 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">转化漏斗分析</h3>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{stage.stage}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${stage.rate}%` }}
                    >
                      {stage.rate}%
                    </div>
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-medium text-gray-900">
                  {formatNumber(stage.count)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 收入预测 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">收入预测</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-2">$3.2M</div>
              <div className="text-sm text-gray-600">下月预测收入</div>
              <div className="text-sm text-green-600 mt-1">+12.5% 增长</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-2">$9.8M</div>
              <div className="text-sm text-gray-600">季度预测收入</div>
              <div className="text-sm text-green-600 mt-1">+18.2% 增长</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-2">$42.5M</div>
              <div className="text-sm text-gray-600">年度预测收入</div>
              <div className="text-sm text-green-600 mt-1">+25.8% 增长</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和控制 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商业模式管理</h1>
          <p className="text-gray-600">管理和优化平台的各种商业模式和收入来源</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="1y">最近1年</option>
          </select>
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新数据
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              收入概览
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              订阅服务
            </button>
            <button
              onClick={() => setActiveTab('trading')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trading'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              交易手续费
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              数据分析
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'subscriptions' && renderSubscriptions()}
          {activeTab === 'trading' && renderTrading()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default BusinessManagement;

