import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Flag
} from 'lucide-react';

const TradingRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: '7d',
    status: 'all',
    type: 'all',
    symbol: '',
    userId: '',
    minAmount: '',
    maxAmount: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // 模拟交易记录数据
  const mockTradingData = [
    {
      id: 'TXN001',
      userId: 'user_123',
      username: 'alice_trader',
      type: 'buy',
      symbol: 'BTC/USDT',
      amount: 0.5,
      price: 45000,
      totalValue: 22500,
      fee: 22.5,
      feeRate: 0.1,
      status: 'completed',
      timestamp: new Date('2024-12-29T10:30:00'),
      orderId: 'ORD_001',
      executionTime: 150,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      riskLevel: 'low',
      isAnomalous: false
    },
    {
      id: 'TXN002',
      userId: 'user_456',
      username: 'bob_investor',
      type: 'sell',
      symbol: 'ETH/USDT',
      amount: 10,
      price: 2400,
      totalValue: 24000,
      fee: 24,
      feeRate: 0.1,
      status: 'completed',
      timestamp: new Date('2024-12-29T10:25:00'),
      orderId: 'ORD_002',
      executionTime: 200,
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0...',
      riskLevel: 'medium',
      isAnomalous: false
    },
    {
      id: 'TXN003',
      userId: 'user_789',
      username: 'charlie_whale',
      type: 'buy',
      symbol: 'BTC/USDT',
      amount: 50,
      price: 44800,
      totalValue: 2240000,
      fee: 2240,
      feeRate: 0.1,
      status: 'pending',
      timestamp: new Date('2024-12-29T10:20:00'),
      orderId: 'ORD_003',
      executionTime: null,
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0...',
      riskLevel: 'high',
      isAnomalous: true
    },
    {
      id: 'TXN004',
      userId: 'user_321',
      username: 'diana_day_trader',
      type: 'sell',
      symbol: 'ADA/USDT',
      amount: 10000,
      price: 0.45,
      totalValue: 4500,
      fee: 4.5,
      feeRate: 0.1,
      status: 'failed',
      timestamp: new Date('2024-12-29T10:15:00'),
      orderId: 'ORD_004',
      executionTime: null,
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0...',
      riskLevel: 'low',
      isAnomalous: false,
      failureReason: '余额不足'
    },
    {
      id: 'TXN005',
      userId: 'user_654',
      username: 'eve_scalper',
      type: 'buy',
      symbol: 'SOL/USDT',
      amount: 100,
      price: 95,
      totalValue: 9500,
      fee: 9.5,
      feeRate: 0.1,
      status: 'completed',
      timestamp: new Date('2024-12-29T10:10:00'),
      orderId: 'ORD_005',
      executionTime: 120,
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0...',
      riskLevel: 'medium',
      isAnomalous: false
    }
  ];

  // 状态配置
  const statusConfig = {
    completed: { 
      color: 'text-green-600 bg-green-100', 
      icon: CheckCircle, 
      label: '已完成' 
    },
    pending: { 
      color: 'text-yellow-600 bg-yellow-100', 
      icon: Clock, 
      label: '处理中' 
    },
    failed: { 
      color: 'text-red-600 bg-red-100', 
      icon: AlertTriangle, 
      label: '失败' 
    },
    cancelled: { 
      color: 'text-gray-600 bg-gray-100', 
      icon: AlertTriangle, 
      label: '已取消' 
    }
  };

  // 交易类型配置
  const typeConfig = {
    buy: { 
      color: 'text-green-600 bg-green-100', 
      icon: TrendingUp, 
      label: '买入' 
    },
    sell: { 
      color: 'text-red-600 bg-red-100', 
      icon: TrendingDown, 
      label: '卖出' 
    }
  };

  // 风险等级配置
  const riskConfig = {
    low: { color: 'text-green-600', label: '低风险' },
    medium: { color: 'text-yellow-600', label: '中风险' },
    high: { color: 'text-red-600', label: '高风险' }
  };

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setRecords(mockTradingData);
      setLoading(false);
    }, 1000);
  }, []);

  // 过滤交易记录
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || record.status === filters.status;
    const matchesType = filters.type === 'all' || record.type === filters.type;
    const matchesSymbol = !filters.symbol || record.symbol.toLowerCase().includes(filters.symbol.toLowerCase());
    const matchesUserId = !filters.userId || record.userId.includes(filters.userId);
    
    const matchesAmount = (!filters.minAmount || record.totalValue >= parseFloat(filters.minAmount)) &&
                         (!filters.maxAmount || record.totalValue <= parseFloat(filters.maxAmount));

    return matchesSearch && matchesStatus && matchesType && matchesSymbol && matchesUserId && matchesAmount;
  });

  // 计算统计数据
  const stats = {
    totalRecords: records.length,
    completedRecords: records.filter(r => r.status === 'completed').length,
    totalVolume: records.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalValue, 0),
    totalFees: records.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.fee, 0),
    anomalousRecords: records.filter(r => r.isAnomalous).length,
    avgExecutionTime: records.filter(r => r.executionTime).reduce((sum, r, _, arr) => sum + r.executionTime / arr.length, 0)
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const exportData = () => {
    // 模拟导出功能
    const csvContent = [
      ['交易ID', '用户名', '类型', '交易对', '数量', '价格', '总价值', '手续费', '状态', '时间'].join(','),
      ...filteredRecords.map(record => [
        record.id,
        record.username,
        record.type,
        record.symbol,
        record.amount,
        record.price,
        record.totalValue,
        record.fee,
        record.status,
        record.timestamp.toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trading_records.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderRecordCard = (record) => {
    const statusInfo = statusConfig[record.status];
    const typeInfo = typeConfig[record.type];
    const riskInfo = riskConfig[record.riskLevel];
    const StatusIcon = statusInfo.icon;
    const TypeIcon = typeInfo.icon;

    return (
      <div key={record.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          {/* 记录头部 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 mr-3">{record.id}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  <StatusIcon className="w-3 h-3 inline mr-1" />
                  {statusInfo.label}
                </span>
                {record.isAnomalous && (
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100">
                    <Flag className="w-3 h-3 inline mr-1" />
                    异常
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className="mr-4">用户: {record.username}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${typeInfo.color}`}>
                  <TypeIcon className="w-3 h-3 inline mr-1" />
                  {typeInfo.label}
                </span>
                <span className="font-mono">{record.symbol}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className={riskInfo.color}>风险等级: {riskInfo.label}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedRecord(record)}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* 交易详情 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500">数量</div>
              <div className="text-lg font-semibold text-gray-900">{record.amount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">价格</div>
              <div className="text-lg font-semibold text-gray-900">${record.price.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">总价值</div>
              <div className="text-lg font-semibold text-gray-900">${record.totalValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">手续费</div>
              <div className="text-lg font-semibold text-gray-900">${record.fee}</div>
            </div>
          </div>

          {/* 时间和执行信息 */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>时间: {record.timestamp.toLocaleString()}</span>
              {record.executionTime && (
                <span>执行时间: {record.executionTime}ms</span>
              )}
              {record.failureReason && (
                <span className="text-red-600">失败原因: {record.failureReason}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecordDetail = () => {
    if (!selectedRecord) return null;

    const statusInfo = statusConfig[selectedRecord.status];
    const typeInfo = typeConfig[selectedRecord.type];
    const StatusIcon = statusInfo.icon;
    const TypeIcon = typeInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">交易详情 - {selectedRecord.id}</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">交易ID:</span>
                    <span className="font-mono">{selectedRecord.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">订单ID:</span>
                    <span className="font-mono">{selectedRecord.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">用户ID:</span>
                    <span className="font-mono">{selectedRecord.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">用户名:</span>
                    <span>{selectedRecord.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">状态:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">类型:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>
                      <TypeIcon className="w-3 h-3 inline mr-1" />
                      {typeInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* 交易信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">交易信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">交易对:</span>
                    <span className="font-mono">{selectedRecord.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">数量:</span>
                    <span>{selectedRecord.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">价格:</span>
                    <span>${selectedRecord.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">总价值:</span>
                    <span className="font-semibold">${selectedRecord.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">手续费:</span>
                    <span>${selectedRecord.fee} ({selectedRecord.feeRate}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">风险等级:</span>
                    <span className={riskConfig[selectedRecord.riskLevel].color}>
                      {riskConfig[selectedRecord.riskLevel].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* 技术信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">技术信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">时间戳:</span>
                    <span>{selectedRecord.timestamp.toISOString()}</span>
                  </div>
                  {selectedRecord.executionTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">执行时间:</span>
                      <span>{selectedRecord.executionTime}ms</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">IP地址:</span>
                    <span className="font-mono">{selectedRecord.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">异常标记:</span>
                    <span className={selectedRecord.isAnomalous ? 'text-red-600' : 'text-green-600'}>
                      {selectedRecord.isAnomalous ? '是' : '否'}
                    </span>
                  </div>
                  {selectedRecord.failureReason && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">失败原因:</span>
                      <span className="text-red-600">{selectedRecord.failureReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作历史 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">操作历史</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">创建:</span> {selectedRecord.timestamp.toLocaleString()}
                  </div>
                  {selectedRecord.status === 'completed' && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">完成:</span> {new Date(selectedRecord.timestamp.getTime() + (selectedRecord.executionTime || 0)).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                查看用户详情
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                查看订单历史
              </button>
              {selectedRecord.isAnomalous && (
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  标记为正常
                </button>
              )}
              {selectedRecord.status === 'pending' && (
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  取消交易
                </button>
              )}
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
          <h1 className="text-2xl font-bold text-gray-900">交易记录管理</h1>
          <p className="text-gray-600">监控和管理所有加密货币交易记录</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </button>
          <button
            onClick={exportData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            导出
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">总记录</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">已完成</p>
              <p className="text-lg font-bold text-gray-900">{stats.completedRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">总交易量</p>
              <p className="text-lg font-bold text-gray-900">${(stats.totalVolume / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">手续费收入</p>
              <p className="text-lg font-bold text-gray-900">${stats.totalFees.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">异常记录</p>
              <p className="text-lg font-bold text-gray-900">{stats.anomalousRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">平均执行</p>
              <p className="text-lg font-bold text-gray-900">{Math.round(stats.avgExecutionTime)}ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索用户名、交易对或ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有状态</option>
            <option value="completed">已完成</option>
            <option value="pending">处理中</option>
            <option value="failed">失败</option>
            <option value="cancelled">已取消</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有类型</option>
            <option value="buy">买入</option>
            <option value="sell">卖出</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">今天</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="交易对 (如: BTC/USDT)"
            value={filters.symbol}
            onChange={(e) => setFilters({...filters, symbol: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="用户ID"
            value={filters.userId}
            onChange={(e) => setFilters({...filters, userId: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="最小金额"
            value={filters.minAmount}
            onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="最大金额"
            value={filters.maxAmount}
            onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 交易记录列表 */}
      <div className="space-y-4">
        {filteredRecords.map(renderRecordCard)}
      </div>

      {/* 空状态 */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到交易记录</h3>
          <p className="text-gray-600">尝试调整搜索条件或过滤器</p>
        </div>
      )}

      {/* 分页 */}
      {filteredRecords.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm text-gray-600">
            显示 {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredRecords.length)} 条，共 {filteredRecords.length} 条记录
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * pageSize >= filteredRecords.length}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {/* 交易详情弹窗 */}
      {renderRecordDetail()}
    </div>
  );
};

export default TradingRecords;

