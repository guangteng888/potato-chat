import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  RefreshCw,
  User,
  Calendar,
  FileText,
  Star,
  Shield,
  Zap,
  Globe,
  Code,
  Settings,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Archive
} from 'lucide-react';

const AppReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    dateRange: '30d'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // 模拟应用数据
  const mockApplications = [
    {
      id: 'APP001',
      name: 'CryptoTrader Pro',
      version: '2.1.0',
      developer: {
        id: 'dev_001',
        name: 'TechCorp Solutions',
        email: 'dev@techcorp.com',
        verified: true
      },
      category: 'trading',
      description: '专业的加密货币交易应用，提供实时行情和高级交易工具',
      status: 'pending',
      priority: 'high',
      submittedAt: new Date('2024-12-28T10:00:00'),
      reviewDeadline: new Date('2024-12-31T23:59:59'),
      reviewer: null,
      reviewStartedAt: null,
      reviewCompletedAt: null,
      reviewComments: '',
      screenshots: [
        '/screenshots/app001_1.png',
        '/screenshots/app001_2.png',
        '/screenshots/app001_3.png'
      ],
      features: [
        '实时行情数据',
        '高级图表分析',
        '多种订单类型',
        '风险管理工具',
        '社交交易功能'
      ],
      permissions: [
        'INTERNET',
        'CAMERA',
        'STORAGE',
        'LOCATION'
      ],
      fileSize: '45.2 MB',
      minSdkVersion: '21',
      targetSdkVersion: '34',
      packageName: 'com.techcorp.cryptotrader',
      securityScore: 85,
      performanceScore: 92,
      complianceChecks: {
        privacy: true,
        security: true,
        content: true,
        technical: false
      },
      previousVersions: 3,
      downloadCount: 0,
      rating: 0,
      tags: ['trading', 'crypto', 'finance', 'professional']
    },
    {
      id: 'APP002',
      name: 'Social Chat Plus',
      version: '1.5.2',
      developer: {
        id: 'dev_002',
        name: 'ChatTech Inc',
        email: 'support@chattech.com',
        verified: false
      },
      category: 'social',
      description: '增强版社交聊天应用，支持群组聊天和文件分享',
      status: 'in_review',
      priority: 'medium',
      submittedAt: new Date('2024-12-27T14:30:00'),
      reviewDeadline: new Date('2024-12-30T23:59:59'),
      reviewer: {
        id: 'reviewer_001',
        name: 'Alice Johnson'
      },
      reviewStartedAt: new Date('2024-12-28T09:00:00'),
      reviewCompletedAt: null,
      reviewComments: '正在进行安全性检查...',
      screenshots: [
        '/screenshots/app002_1.png',
        '/screenshots/app002_2.png'
      ],
      features: [
        '端到端加密',
        '群组聊天',
        '文件分享',
        '语音消息',
        '状态更新'
      ],
      permissions: [
        'INTERNET',
        'CAMERA',
        'MICROPHONE',
        'STORAGE',
        'CONTACTS'
      ],
      fileSize: '28.7 MB',
      minSdkVersion: '23',
      targetSdkVersion: '34',
      packageName: 'com.chattech.socialplus',
      securityScore: 78,
      performanceScore: 88,
      complianceChecks: {
        privacy: true,
        security: false,
        content: true,
        technical: true
      },
      previousVersions: 5,
      downloadCount: 0,
      rating: 0,
      tags: ['social', 'chat', 'messaging', 'communication']
    },
    {
      id: 'APP003',
      name: 'Portfolio Manager',
      version: '3.0.1',
      developer: {
        id: 'dev_003',
        name: 'FinanceApps Ltd',
        email: 'dev@financeapps.com',
        verified: true
      },
      category: 'finance',
      description: '投资组合管理工具，帮助用户跟踪和分析投资表现',
      status: 'approved',
      priority: 'medium',
      submittedAt: new Date('2024-12-25T11:15:00'),
      reviewDeadline: new Date('2024-12-28T23:59:59'),
      reviewer: {
        id: 'reviewer_002',
        name: 'Bob Smith'
      },
      reviewStartedAt: new Date('2024-12-26T10:00:00'),
      reviewCompletedAt: new Date('2024-12-27T16:30:00'),
      reviewComments: '应用质量优秀，符合所有审核标准。已批准上线。',
      screenshots: [
        '/screenshots/app003_1.png',
        '/screenshots/app003_2.png',
        '/screenshots/app003_3.png',
        '/screenshots/app003_4.png'
      ],
      features: [
        '投资组合跟踪',
        '收益分析',
        '风险评估',
        '市场数据',
        '报告生成'
      ],
      permissions: [
        'INTERNET',
        'STORAGE'
      ],
      fileSize: '32.1 MB',
      minSdkVersion: '21',
      targetSdkVersion: '34',
      packageName: 'com.financeapps.portfolio',
      securityScore: 95,
      performanceScore: 94,
      complianceChecks: {
        privacy: true,
        security: true,
        content: true,
        technical: true
      },
      previousVersions: 8,
      downloadCount: 1250,
      rating: 4.6,
      tags: ['finance', 'portfolio', 'investment', 'analytics']
    },
    {
      id: 'APP004',
      name: 'News Reader Pro',
      version: '1.2.0',
      developer: {
        id: 'dev_004',
        name: 'NewsFlow Media',
        email: 'contact@newsflow.com',
        verified: false
      },
      category: 'news',
      description: '智能新闻阅读器，提供个性化新闻推荐和离线阅读',
      status: 'rejected',
      priority: 'low',
      submittedAt: new Date('2024-12-24T16:45:00'),
      reviewDeadline: new Date('2024-12-27T23:59:59'),
      reviewer: {
        id: 'reviewer_003',
        name: 'Carol Davis'
      },
      reviewStartedAt: new Date('2024-12-25T14:00:00'),
      reviewCompletedAt: new Date('2024-12-26T11:20:00'),
      reviewComments: '应用存在隐私政策不完整和未经授权的数据收集问题。需要修复后重新提交。',
      screenshots: [
        '/screenshots/app004_1.png',
        '/screenshots/app004_2.png'
      ],
      features: [
        '个性化推荐',
        '离线阅读',
        '多源聚合',
        '分类浏览',
        '收藏功能'
      ],
      permissions: [
        'INTERNET',
        'STORAGE',
        'LOCATION',
        'CONTACTS'
      ],
      fileSize: '19.8 MB',
      minSdkVersion: '21',
      targetSdkVersion: '33',
      packageName: 'com.newsflow.reader',
      securityScore: 65,
      performanceScore: 82,
      complianceChecks: {
        privacy: false,
        security: true,
        content: true,
        technical: true
      },
      previousVersions: 2,
      downloadCount: 0,
      rating: 0,
      tags: ['news', 'reading', 'media', 'information']
    },
    {
      id: 'APP005',
      name: 'Fitness Tracker',
      version: '2.3.1',
      developer: {
        id: 'dev_005',
        name: 'HealthTech Solutions',
        email: 'dev@healthtech.com',
        verified: true
      },
      category: 'health',
      description: '全面的健身追踪应用，记录运动数据和健康指标',
      status: 'pending',
      priority: 'low',
      submittedAt: new Date('2024-12-29T08:20:00'),
      reviewDeadline: new Date('2025-01-02T23:59:59'),
      reviewer: null,
      reviewStartedAt: null,
      reviewCompletedAt: null,
      reviewComments: '',
      screenshots: [
        '/screenshots/app005_1.png',
        '/screenshots/app005_2.png',
        '/screenshots/app005_3.png'
      ],
      features: [
        '运动追踪',
        '健康监测',
        '目标设定',
        '数据分析',
        '社交分享'
      ],
      permissions: [
        'INTERNET',
        'LOCATION',
        'CAMERA',
        'STORAGE',
        'SENSORS'
      ],
      fileSize: '41.5 MB',
      minSdkVersion: '23',
      targetSdkVersion: '34',
      packageName: 'com.healthtech.fitness',
      securityScore: 88,
      performanceScore: 90,
      complianceChecks: {
        privacy: true,
        security: true,
        content: true,
        technical: true
      },
      previousVersions: 6,
      downloadCount: 0,
      rating: 0,
      tags: ['health', 'fitness', 'tracking', 'wellness']
    }
  ];

  // 状态配置
  const statusConfig = {
    pending: { 
      color: 'text-yellow-600 bg-yellow-100', 
      icon: Clock, 
      label: '待审核' 
    },
    in_review: { 
      color: 'text-blue-600 bg-blue-100', 
      icon: Eye, 
      label: '审核中' 
    },
    approved: { 
      color: 'text-green-600 bg-green-100', 
      icon: CheckCircle, 
      label: '已批准' 
    },
    rejected: { 
      color: 'text-red-600 bg-red-100', 
      icon: XCircle, 
      label: '已拒绝' 
    },
    revision_required: { 
      color: 'text-orange-600 bg-orange-100', 
      icon: AlertTriangle, 
      label: '需修改' 
    }
  };

  // 优先级配置
  const priorityConfig = {
    high: { color: 'text-red-600', label: '高' },
    medium: { color: 'text-yellow-600', label: '中' },
    low: { color: 'text-green-600', label: '低' }
  };

  // 分类配置
  const categoryConfig = {
    trading: { icon: TrendingUp, label: '交易', color: 'bg-blue-100 text-blue-800' },
    social: { icon: MessageSquare, label: '社交', color: 'bg-green-100 text-green-800' },
    finance: { icon: DollarSign, label: '金融', color: 'bg-yellow-100 text-yellow-800' },
    news: { icon: FileText, label: '新闻', color: 'bg-purple-100 text-purple-800' },
    health: { icon: Heart, label: '健康', color: 'bg-red-100 text-red-800' },
    utility: { icon: Settings, label: '工具', color: 'bg-gray-100 text-gray-800' }
  };

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  // 过滤应用列表
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || app.status === filters.status;
    const matchesCategory = filters.category === 'all' || app.category === filters.category;
    const matchesPriority = filters.priority === 'all' || app.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // 计算统计数据
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    inReview: applications.filter(app => app.status === 'in_review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    avgReviewTime: 2.5 // 天
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const startReview = (app) => {
    setSelectedApp(app);
    setReviewMode(true);
  };

  const submitReview = (appId, decision, comments) => {
    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? {
            ...app,
            status: decision,
            reviewComments: comments,
            reviewCompletedAt: new Date(),
            reviewer: { id: 'current_reviewer', name: 'Current Reviewer' }
          }
        : app
    ));
    setReviewMode(false);
    setSelectedApp(null);
  };

  const renderAppCard = (app) => {
    const statusInfo = statusConfig[app.status];
    const priorityInfo = priorityConfig[app.priority];
    const categoryInfo = categoryConfig[app.category];
    const StatusIcon = statusInfo.icon;
    const CategoryIcon = categoryInfo.icon;

    const isOverdue = app.reviewDeadline < new Date() && app.status !== 'approved' && app.status !== 'rejected';

    return (
      <div key={app.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          {/* 应用头部 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                <Smartphone className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                <p className="text-sm text-gray-600">v{app.version} • {app.developer.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isOverdue && (
                <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  逾期
                </span>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                <StatusIcon className="w-3 h-3 inline mr-1" />
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* 应用信息 */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${categoryInfo.color}`}>
                <CategoryIcon className="w-3 h-3 inline mr-1" />
                {categoryInfo.label}
              </span>
              <span className={`text-xs font-medium ${priorityInfo.color}`}>
                优先级: {priorityInfo.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
          </div>

          {/* 应用指标 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{app.securityScore}</div>
              <div className="text-xs text-gray-500">安全分数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{app.performanceScore}</div>
              <div className="text-xs text-gray-500">性能分数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{app.fileSize}</div>
              <div className="text-xs text-gray-500">文件大小</div>
            </div>
          </div>

          {/* 合规检查 */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">合规检查</div>
            <div className="flex space-x-2">
              {Object.entries(app.complianceChecks).map(([key, passed]) => (
                <span
                  key={key}
                  className={`px-2 py-1 rounded text-xs ${
                    passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {passed ? '✓' : '✗'} {key}
                </span>
              ))}
            </div>
          </div>

          {/* 时间信息 */}
          <div className="text-xs text-gray-500 mb-4">
            <div>提交时间: {app.submittedAt.toLocaleString()}</div>
            <div>截止时间: {app.reviewDeadline.toLocaleString()}</div>
            {app.reviewStartedAt && (
              <div>开始审核: {app.reviewStartedAt.toLocaleString()}</div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedApp(app)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Eye className="w-4 h-4 inline mr-1" />
              查看详情
            </button>
            {(app.status === 'pending' || app.status === 'in_review') && (
              <button
                onClick={() => startReview(app)}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                开始审核
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAppDetail = () => {
    if (!selectedApp) return null;

    const statusInfo = statusConfig[selectedApp.status];
    const categoryInfo = categoryConfig[selectedApp.category];
    const StatusIcon = statusInfo.icon;
    const CategoryIcon = categoryInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                  <Smartphone className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedApp.name}</h2>
                  <p className="text-gray-600">v{selectedApp.version} • {selectedApp.developer.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 基本信息 */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">应用信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">应用描述</label>
                    <p className="text-gray-900">{selectedApp.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">分类</label>
                      <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${categoryInfo.color}`}>
                        <CategoryIcon className="w-4 h-4 mr-1" />
                        {categoryInfo.label}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">状态</label>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {statusInfo.label}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">主要功能</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedApp.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">权限要求</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedApp.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedApp.reviewComments && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">审核意见</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedApp.reviewComments}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 技术信息和统计 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">技术信息</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">应用包信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">包名:</span>
                        <span className="font-mono text-xs">{selectedApp.packageName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">文件大小:</span>
                        <span>{selectedApp.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">最低SDK:</span>
                        <span>{selectedApp.minSdkVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">目标SDK:</span>
                        <span>{selectedApp.targetSdkVersion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">质量评分</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">安全性</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${selectedApp.securityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{selectedApp.securityScore}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">性能</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${selectedApp.performanceScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{selectedApp.performanceScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">合规检查</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedApp.complianceChecks).map(([key, passed]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 capitalize">{key}</span>
                          <span className={`text-sm font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
                            {passed ? '✓ 通过' : '✗ 未通过'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">开发者信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">开发者:</span>
                        <span>{selectedApp.developer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">邮箱:</span>
                        <span className="text-xs">{selectedApp.developer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">认证状态:</span>
                        <span className={selectedApp.developer.verified ? 'text-green-600' : 'text-red-600'}>
                          {selectedApp.developer.verified ? '已认证' : '未认证'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4 inline mr-2" />
                下载APK
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Eye className="w-4 h-4 inline mr-2" />
                查看截图
              </button>
              {(selectedApp.status === 'pending' || selectedApp.status === 'in_review') && (
                <button 
                  onClick={() => startReview(selectedApp)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  开始审核
                </button>
              )}
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                查看历史版本
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewModal = () => {
    if (!reviewMode || !selectedApp) return null;

    const [decision, setDecision] = useState('');
    const [comments, setComments] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">审核应用 - {selectedApp.name}</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">审核决定</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decision"
                      value="approved"
                      checked={decision === 'approved'}
                      onChange={(e) => setDecision(e.target.value)}
                      className="mr-2"
                    />
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    批准上线
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decision"
                      value="rejected"
                      checked={decision === 'rejected'}
                      onChange={(e) => setDecision(e.target.value)}
                      className="mr-2"
                    />
                    <XCircle className="w-4 h-4 text-red-600 mr-1" />
                    拒绝上线
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="decision"
                      value="revision_required"
                      checked={decision === 'revision_required'}
                      onChange={(e) => setDecision(e.target.value)}
                      className="mr-2"
                    />
                    <AlertTriangle className="w-4 h-4 text-orange-600 mr-1" />
                    需要修改
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">审核意见</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入详细的审核意见..."
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => {
                  if (decision && comments) {
                    submitReview(selectedApp.id, decision, comments);
                  }
                }}
                disabled={!decision || !comments}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交审核
              </button>
              <button
                onClick={() => setReviewMode(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                取消
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
          <h1 className="text-2xl font-bold text-gray-900">应用审核管理</h1>
          <p className="text-gray-600">管理小程序和应用的提交、审核和发布流程</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新数据
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">总应用</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">待审核</p>
              <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">审核中</p>
              <p className="text-lg font-bold text-gray-900">{stats.inReview}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">已批准</p>
              <p className="text-lg font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">已拒绝</p>
              <p className="text-lg font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600">平均审核</p>
              <p className="text-lg font-bold text-gray-900">{stats.avgReviewTime}天</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索应用名称、开发者或ID..."
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
            <option value="pending">待审核</option>
            <option value="in_review">审核中</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒绝</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有分类</option>
            <option value="trading">交易</option>
            <option value="social">社交</option>
            <option value="finance">金融</option>
            <option value="news">新闻</option>
            <option value="health">健康</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有优先级</option>
            <option value="high">高优先级</option>
            <option value="medium">中优先级</option>
            <option value="low">低优先级</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>
      </div>

      {/* 应用列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map(renderAppCard)}
      </div>

      {/* 空状态 */}
      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到应用</h3>
          <p className="text-gray-600">尝试调整搜索条件或过滤器</p>
        </div>
      )}

      {/* 应用详情弹窗 */}
      {renderAppDetail()}

      {/* 审核弹窗 */}
      {renderReviewModal()}
    </div>
  );
};

export default AppReview;

