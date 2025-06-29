import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  Download,
  Settings,
  Eye,
  BarChart3,
  Zap
} from 'lucide-react';

const ApiManagement = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApi, setSelectedApi] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 模拟API数据
  const mockApiData = [
    {
      id: 1,
      name: 'User Authentication API',
      endpoint: '/api/auth/login',
      method: 'POST',
      status: 'healthy',
      uptime: 99.9,
      avgResponseTime: 120,
      requestsToday: 15420,
      errorsToday: 12,
      lastChecked: new Date(),
      description: '用户登录认证接口',
      version: 'v1.0',
      rateLimit: '1000/hour',
      documentation: '/docs/auth'
    },
    {
      id: 2,
      name: 'Trading Data API',
      endpoint: '/api/trading/data',
      method: 'GET',
      status: 'warning',
      uptime: 98.5,
      avgResponseTime: 350,
      requestsToday: 28750,
      errorsToday: 45,
      lastChecked: new Date(),
      description: '交易数据查询接口',
      version: 'v2.1',
      rateLimit: '500/hour',
      documentation: '/docs/trading'
    },
    {
      id: 3,
      name: 'User Management API',
      endpoint: '/api/users',
      method: 'GET',
      status: 'error',
      uptime: 95.2,
      avgResponseTime: 890,
      requestsToday: 8920,
      errorsToday: 156,
      lastChecked: new Date(),
      description: '用户管理接口',
      version: 'v1.5',
      rateLimit: '200/hour',
      documentation: '/docs/users'
    },
    {
      id: 4,
      name: 'Payment Processing API',
      endpoint: '/api/payments/process',
      method: 'POST',
      status: 'healthy',
      uptime: 99.8,
      avgResponseTime: 200,
      requestsToday: 5670,
      errorsToday: 3,
      lastChecked: new Date(),
      description: '支付处理接口',
      version: 'v3.0',
      rateLimit: '100/hour',
      documentation: '/docs/payments'
    },
    {
      id: 5,
      name: 'Notification API',
      endpoint: '/api/notifications/send',
      method: 'POST',
      status: 'healthy',
      uptime: 99.7,
      avgResponseTime: 85,
      requestsToday: 12340,
      errorsToday: 8,
      lastChecked: new Date(),
      description: '消息通知接口',
      version: 'v1.2',
      rateLimit: '2000/hour',
      documentation: '/docs/notifications'
    },
    {
      id: 6,
      name: 'Analytics API',
      endpoint: '/api/analytics/stats',
      method: 'GET',
      status: 'maintenance',
      uptime: 0,
      avgResponseTime: 0,
      requestsToday: 0,
      errorsToday: 0,
      lastChecked: new Date(),
      description: '数据分析接口',
      version: 'v2.0',
      rateLimit: '50/hour',
      documentation: '/docs/analytics'
    }
  ];

  // 状态配置
  const statusConfig = {
    healthy: { 
      color: 'text-green-600 bg-green-100', 
      icon: CheckCircle, 
      label: '正常' 
    },
    warning: { 
      color: 'text-yellow-600 bg-yellow-100', 
      icon: AlertTriangle, 
      label: '警告' 
    },
    error: { 
      color: 'text-red-600 bg-red-100', 
      icon: XCircle, 
      label: '错误' 
    },
    maintenance: { 
      color: 'text-gray-600 bg-gray-100', 
      icon: Settings, 
      label: '维护中' 
    }
  };

  // HTTP方法颜色配置
  const methodColors = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800'
  };

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setApis(mockApiData);
      setLoading(false);
    }, 1000);
  }, []);

  // 过滤API列表
  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || api.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 计算总体统计
  const totalRequests = apis.reduce((sum, api) => sum + api.requestsToday, 0);
  const totalErrors = apis.reduce((sum, api) => sum + api.errorsToday, 0);
  const avgUptime = apis.length > 0 ? apis.reduce((sum, api) => sum + api.uptime, 0) / apis.length : 0;
  const healthyApis = apis.filter(api => api.status === 'healthy').length;

  const refreshData = () => {
    setLoading(true);
    // 模拟刷新数据
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const renderApiCard = (api) => {
    const statusInfo = statusConfig[api.status];
    const StatusIcon = statusInfo.icon;

    return (
      <div key={api.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          {/* API头部信息 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 mr-3">{api.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  <StatusIcon className="w-3 h-3 inline mr-1" />
                  {statusInfo.label}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${methodColors[api.method]}`}>
                  {api.method}
                </span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{api.endpoint}</code>
              </div>
              <p className="text-sm text-gray-600">{api.description}</p>
            </div>
            <button
              onClick={() => setSelectedApi(api)}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* API指标 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{api.uptime}%</div>
              <div className="text-xs text-gray-500">可用性</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{api.avgResponseTime}ms</div>
              <div className="text-xs text-gray-500">响应时间</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{api.requestsToday.toLocaleString()}</div>
              <div className="text-xs text-gray-500">今日请求</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{api.errorsToday}</div>
              <div className="text-xs text-gray-500">今日错误</div>
            </div>
          </div>

          {/* API详细信息 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>版本: {api.version}</span>
              <span>限流: {api.rateLimit}</span>
              <span>最后检查: {api.lastChecked.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderApiDetail = () => {
    if (!selectedApi) return null;

    const statusInfo = statusConfig[selectedApi.status];
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{selectedApi.name}</h2>
              <button
                onClick={() => setSelectedApi(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* API基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">状态:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">方法:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${methodColors[selectedApi.method]}`}>
                      {selectedApi.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">端点:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{selectedApi.endpoint}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">版本:</span>
                    <span className="text-gray-900">{selectedApi.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">限流:</span>
                    <span className="text-gray-900">{selectedApi.rateLimit}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">性能指标</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">可用性:</span>
                    <span className="text-gray-900 font-medium">{selectedApi.uptime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均响应时间:</span>
                    <span className="text-gray-900 font-medium">{selectedApi.avgResponseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">今日请求数:</span>
                    <span className="text-gray-900 font-medium">{selectedApi.requestsToday.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">今日错误数:</span>
                    <span className="text-red-600 font-medium">{selectedApi.errorsToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">错误率:</span>
                    <span className="text-red-600 font-medium">
                      {selectedApi.requestsToday > 0 ? ((selectedApi.errorsToday / selectedApi.requestsToday) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                查看文档
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                测试API
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                查看日志
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                配置监控
              </button>
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
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API管理</h1>
          <p className="text-gray-600">监控和管理所有API接口的状态和性能</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新数据
        </button>
      </div>

      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">API总数</p>
              <p className="text-2xl font-bold text-gray-900">{apis.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">健康API</p>
              <p className="text-2xl font-bold text-gray-900">{healthyApis}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">今日请求</p>
              <p className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">今日错误</p>
              <p className="text-2xl font-bold text-gray-900">{totalErrors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索API..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有状态</option>
              <option value="healthy">正常</option>
              <option value="warning">警告</option>
              <option value="error">错误</option>
              <option value="maintenance">维护中</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <BarChart3 className="w-4 h-4 mr-2" />
              性能分析
            </button>
          </div>
        </div>
      </div>

      {/* API列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApis.map(renderApiCard)}
      </div>

      {/* 空状态 */}
      {filteredApis.length === 0 && (
        <div className="text-center py-12">
          <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到API</h3>
          <p className="text-gray-600">尝试调整搜索条件或过滤器</p>
        </div>
      )}

      {/* API详情弹窗 */}
      {renderApiDetail()}
    </div>
  );
};

export default ApiManagement;

