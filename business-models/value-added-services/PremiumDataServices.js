const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 数据服务订阅模型
const dataSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['basic_data', 'advanced_data', 'realtime_stream', 'historical_data', 'ai_insights', 'custom_reports'],
    required: true
  },
  plan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  usage: {
    apiCalls: { type: Number, default: 0 },
    dataDownloads: { type: Number, default: 0 },
    reportGenerated: { type: Number, default: 0 },
    lastUsed: Date
  },
  limits: {
    maxApiCalls: Number,
    maxDataDownloads: Number,
    maxReports: Number
  },
  pricing: {
    monthlyFee: Number,
    perCallFee: Number,
    overageFee: Number
  },
  metadata: {
    features: [String],
    customSettings: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DataSubscription = mongoose.model('DataSubscription', dataSubscriptionSchema);

// 数据使用记录模型
const dataUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataSubscription',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  requestData: {
    symbols: [String],
    timeframe: String,
    indicators: [String],
    filters: mongoose.Schema.Types.Mixed
  },
  responseSize: {
    type: Number,
    default: 0
  },
  processingTime: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

const DataUsage = mongoose.model('DataUsage', dataUsageSchema);

// 数据服务配置
const DATA_SERVICES = {
  basic_data: {
    name: '基础数据包',
    description: '基本的市场数据和价格信息',
    plans: {
      starter: {
        price: 29.99,
        limits: { maxApiCalls: 1000, maxDataDownloads: 10, maxReports: 5 },
        features: ['实时价格', '基础图表', '简单指标', '邮件支持']
      },
      professional: {
        price: 79.99,
        limits: { maxApiCalls: 5000, maxDataDownloads: 50, maxReports: 20 },
        features: ['实时价格', '高级图表', '技术指标', '优先支持', 'API访问']
      },
      enterprise: {
        price: 199.99,
        limits: { maxApiCalls: 20000, maxDataDownloads: 200, maxReports: 100 },
        features: ['全部功能', '定制化', '专属支持', '白标服务', 'SLA保障']
      }
    }
  },
  advanced_data: {
    name: '高级数据分析',
    description: '深度市场分析和预测数据',
    plans: {
      starter: {
        price: 59.99,
        limits: { maxApiCalls: 500, maxDataDownloads: 5, maxReports: 3 },
        features: ['市场分析', '趋势预测', '风险评估', '基础报告']
      },
      professional: {
        price: 149.99,
        limits: { maxApiCalls: 2000, maxDataDownloads: 25, maxReports: 15 },
        features: ['深度分析', 'AI预测', '风险模型', '定制报告', 'API集成']
      },
      enterprise: {
        price: 399.99,
        limits: { maxApiCalls: 10000, maxDataDownloads: 100, maxReports: 50 },
        features: ['全部功能', '实时分析', '定制模型', '专属服务', '数据导出']
      }
    }
  },
  realtime_stream: {
    name: '实时数据流',
    description: '毫秒级实时市场数据推送',
    plans: {
      starter: {
        price: 99.99,
        limits: { maxApiCalls: 10000, maxDataDownloads: 0, maxReports: 0 },
        features: ['实时推送', '基础延迟', '5个数据源', '标准支持']
      },
      professional: {
        price: 299.99,
        limits: { maxApiCalls: 50000, maxDataDownloads: 0, maxReports: 0 },
        features: ['低延迟推送', '20个数据源', '数据过滤', '优先支持']
      },
      enterprise: {
        price: 799.99,
        limits: { maxApiCalls: 200000, maxDataDownloads: 0, maxReports: 0 },
        features: ['超低延迟', '全部数据源', '定制推送', '专属通道', 'SLA保障']
      }
    }
  },
  historical_data: {
    name: '历史数据服务',
    description: '完整的历史市场数据和回测支持',
    plans: {
      starter: {
        price: 39.99,
        limits: { maxApiCalls: 200, maxDataDownloads: 20, maxReports: 5 },
        features: ['1年历史', '日线数据', '基础下载', '标准格式']
      },
      professional: {
        price: 99.99,
        limits: { maxApiCalls: 1000, maxDataDownloads: 100, maxReports: 25 },
        features: ['5年历史', '分钟级数据', '批量下载', '多种格式', 'API访问']
      },
      enterprise: {
        price: 249.99,
        limits: { maxApiCalls: 5000, maxDataDownloads: 500, maxReports: 100 },
        features: ['完整历史', '秒级数据', '无限下载', '定制格式', '专属服务']
      }
    }
  },
  ai_insights: {
    name: 'AI智能洞察',
    description: 'AI驱动的市场洞察和投资建议',
    plans: {
      starter: {
        price: 79.99,
        limits: { maxApiCalls: 100, maxDataDownloads: 5, maxReports: 10 },
        features: ['基础AI分析', '市场洞察', '投资建议', '周报']
      },
      professional: {
        price: 199.99,
        limits: { maxApiCalls: 500, maxDataDownloads: 20, maxReports: 50 },
        features: ['高级AI分析', '个性化建议', '风险预警', '日报', 'API访问']
      },
      enterprise: {
        price: 499.99,
        limits: { maxApiCalls: 2000, maxDataDownloads: 100, maxReports: 200 },
        features: ['定制AI模型', '实时洞察', '专属建议', '实时报告', '专属服务']
      }
    }
  },
  custom_reports: {
    name: '定制报告服务',
    description: '个性化的投资分析报告',
    plans: {
      starter: {
        price: 49.99,
        limits: { maxApiCalls: 0, maxDataDownloads: 0, maxReports: 5 },
        features: ['标准模板', '基础定制', 'PDF导出', '邮件发送']
      },
      professional: {
        price: 129.99,
        limits: { maxApiCalls: 0, maxDataDownloads: 0, maxReports: 20 },
        features: ['高级模板', '深度定制', '多种格式', '定时发送', '品牌定制']
      },
      enterprise: {
        price: 299.99,
        limits: { maxApiCalls: 0, maxDataDownloads: 0, maxReports: 100 },
        features: ['完全定制', '白标报告', 'API集成', '实时生成', '专属设计']
      }
    }
  }
};

// 中间件：验证数据服务权限
const checkDataServiceAccess = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { serviceType } = req.params;
    
    const subscription = await DataSubscription.findOne({
      userId,
      serviceType,
      status: 'active',
      endDate: { $gte: new Date() }
    });
    
    if (!subscription) {
      return res.status(403).json({ error: '没有访问此数据服务的权限' });
    }
    
    // 检查使用限制
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    
    const monthlyUsage = await DataUsage.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          subscriptionId: subscription._id,
          timestamp: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          totalDownloads: { $sum: { $cond: [{ $gt: ['$responseSize', 0] }, 1, 0] } },
          totalReports: { $sum: { $cond: [{ $eq: ['$endpoint', 'generate-report'] }, 1, 0] } }
        }
      }
    ]);
    
    const usage = monthlyUsage[0] || { totalCalls: 0, totalDownloads: 0, totalReports: 0 };
    
    // 检查API调用限制
    if (subscription.limits.maxApiCalls && usage.totalCalls >= subscription.limits.maxApiCalls) {
      return res.status(429).json({ error: 'API调用次数已达上限' });
    }
    
    req.subscription = subscription;
    req.currentUsage = usage;
    next();
    
  } catch (error) {
    console.error('验证数据服务权限失败:', error);
    res.status(500).json({ error: '验证权限失败' });
  }
};

// 记录数据使用
const recordDataUsage = async (userId, subscriptionId, serviceType, endpoint, requestData, responseSize, processingTime, cost) => {
  try {
    const usage = new DataUsage({
      userId,
      subscriptionId,
      serviceType,
      endpoint,
      requestData,
      responseSize,
      processingTime,
      cost
    });
    
    await usage.save();
    
    // 更新订阅使用统计
    await DataSubscription.updateOne(
      { _id: subscriptionId },
      {
        $inc: {
          'usage.apiCalls': 1,
          'usage.dataDownloads': responseSize > 0 ? 1 : 0
        },
        $set: { 'usage.lastUsed': new Date() }
      }
    );
    
  } catch (error) {
    console.error('记录数据使用失败:', error);
  }
};

// API路由

// 获取数据服务列表
router.get('/services', (req, res) => {
  res.json({
    success: true,
    services: DATA_SERVICES
  });
});

// 订阅数据服务
router.post('/subscribe', async (req, res) => {
  try {
    const { userId } = req.user;
    const { serviceType, plan } = req.body;
    
    if (!DATA_SERVICES[serviceType]) {
      return res.status(400).json({ error: '无效的服务类型' });
    }
    
    const serviceConfig = DATA_SERVICES[serviceType];
    const planConfig = serviceConfig.plans[plan];
    
    if (!planConfig) {
      return res.status(400).json({ error: '无效的订阅计划' });
    }
    
    // 检查是否已有活跃订阅
    const existingSubscription = await DataSubscription.findOne({
      userId,
      serviceType,
      status: 'active',
      endDate: { $gte: new Date() }
    });
    
    if (existingSubscription) {
      return res.status(400).json({ error: '已有活跃的订阅' });
    }
    
    // 创建新订阅
    const subscription = new DataSubscription({
      userId,
      serviceType,
      plan,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
      limits: planConfig.limits,
      pricing: {
        monthlyFee: planConfig.price
      },
      metadata: {
        features: planConfig.features
      }
    });
    
    await subscription.save();
    
    res.json({
      success: true,
      subscription
    });
    
  } catch (error) {
    console.error('订阅数据服务失败:', error);
    res.status(500).json({ error: '订阅失败' });
  }
});

// 获取用户订阅列表
router.get('/subscriptions', async (req, res) => {
  try {
    const { userId } = req.user;
    
    const subscriptions = await DataSubscription.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      subscriptions
    });
    
  } catch (error) {
    console.error('获取订阅列表失败:', error);
    res.status(500).json({ error: '获取订阅列表失败' });
  }
});

// 基础数据API
router.get('/basic/:serviceType/market-data', checkDataServiceAccess, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { serviceType } = req.params;
    const { symbols, timeframe = '1d', limit = 100 } = req.query;
    
    // 模拟数据获取
    const mockData = {
      symbols: symbols ? symbols.split(',') : ['BTC/USD', 'ETH/USD'],
      timeframe,
      data: Array.from({ length: parseInt(limit) }, (_, i) => ({
        timestamp: Date.now() - i * 24 * 60 * 60 * 1000,
        open: 50000 + Math.random() * 10000,
        high: 52000 + Math.random() * 10000,
        low: 48000 + Math.random() * 10000,
        close: 51000 + Math.random() * 10000,
        volume: Math.random() * 1000000
      }))
    };
    
    const processingTime = Date.now() - startTime;
    const responseSize = JSON.stringify(mockData).length;
    
    // 记录使用
    await recordDataUsage(
      req.user.userId,
      req.subscription._id,
      serviceType,
      'market-data',
      { symbols, timeframe, limit },
      responseSize,
      processingTime,
      0.01
    );
    
    res.json({
      success: true,
      data: mockData,
      metadata: {
        processingTime,
        responseSize,
        remainingCalls: req.subscription.limits.maxApiCalls - req.currentUsage.totalCalls - 1
      }
    });
    
  } catch (error) {
    console.error('获取市场数据失败:', error);
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 高级分析API
router.get('/advanced/:serviceType/analysis', checkDataServiceAccess, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { serviceType } = req.params;
    const { symbol = 'BTC/USD', indicators = 'rsi,macd,bb' } = req.query;
    
    // 模拟高级分析数据
    const mockAnalysis = {
      symbol,
      timestamp: Date.now(),
      technicalIndicators: {
        rsi: 65.5,
        macd: {
          macd: 1250.5,
          signal: 1180.2,
          histogram: 70.3
        },
        bollingerBands: {
          upper: 52500,
          middle: 51000,
          lower: 49500
        }
      },
      sentiment: {
        score: 0.75,
        confidence: 0.85,
        sources: ['social_media', 'news', 'trading_volume']
      },
      prediction: {
        direction: 'bullish',
        confidence: 0.72,
        timeframe: '24h',
        targetPrice: 53000
      },
      riskMetrics: {
        volatility: 0.045,
        sharpeRatio: 1.25,
        maxDrawdown: 0.15
      }
    };
    
    const processingTime = Date.now() - startTime;
    const responseSize = JSON.stringify(mockAnalysis).length;
    
    // 记录使用
    await recordDataUsage(
      req.user.userId,
      req.subscription._id,
      serviceType,
      'analysis',
      { symbol, indicators },
      responseSize,
      processingTime,
      0.05
    );
    
    res.json({
      success: true,
      analysis: mockAnalysis,
      metadata: {
        processingTime,
        responseSize,
        remainingCalls: req.subscription.limits.maxApiCalls - req.currentUsage.totalCalls - 1
      }
    });
    
  } catch (error) {
    console.error('获取分析数据失败:', error);
    res.status(500).json({ error: '获取分析失败' });
  }
});

// 生成定制报告
router.post('/reports/:serviceType/generate', checkDataServiceAccess, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { serviceType } = req.params;
    const { reportType, symbols, timeframe, customSettings } = req.body;
    
    // 检查报告生成限制
    if (req.subscription.limits.maxReports && 
        req.currentUsage.totalReports >= req.subscription.limits.maxReports) {
      return res.status(429).json({ error: '报告生成次数已达上限' });
    }
    
    // 模拟报告生成
    const mockReport = {
      reportId: `report_${Date.now()}`,
      type: reportType,
      symbols,
      timeframe,
      generatedAt: new Date(),
      sections: [
        {
          title: '市场概览',
          content: '当前市场呈现上升趋势，主要加密货币表现强劲...',
          charts: ['price_chart', 'volume_chart']
        },
        {
          title: '技术分析',
          content: '基于技术指标分析，RSI显示超买信号...',
          charts: ['rsi_chart', 'macd_chart']
        },
        {
          title: '风险评估',
          content: '当前投资组合风险水平适中，建议保持现有配置...',
          charts: ['risk_chart']
        }
      ],
      downloadUrl: `/api/reports/download/${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后过期
    };
    
    const processingTime = Date.now() - startTime;
    const responseSize = JSON.stringify(mockReport).length;
    
    // 记录使用
    await recordDataUsage(
      req.user.userId,
      req.subscription._id,
      serviceType,
      'generate-report',
      { reportType, symbols, timeframe },
      responseSize,
      processingTime,
      0.10
    );
    
    res.json({
      success: true,
      report: mockReport,
      metadata: {
        processingTime,
        responseSize,
        remainingReports: req.subscription.limits.maxReports - req.currentUsage.totalReports - 1
      }
    });
    
  } catch (error) {
    console.error('生成报告失败:', error);
    res.status(500).json({ error: '生成报告失败' });
  }
});

// 获取使用统计
router.get('/usage-stats', async (req, res) => {
  try {
    const { userId } = req.user;
    const { period = 'month' } = req.query;
    
    let startDate;
    switch (period) {
      case 'week':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    
    const usageStats = await DataUsage.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            serviceType: '$serviceType',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          calls: { $sum: 1 },
          totalCost: { $sum: '$cost' },
          avgProcessingTime: { $avg: '$processingTime' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    res.json({
      success: true,
      period,
      stats: usageStats
    });
    
  } catch (error) {
    console.error('获取使用统计失败:', error);
    res.status(500).json({ error: '获取统计失败' });
  }
});

// 取消订阅
router.post('/cancel/:subscriptionId', async (req, res) => {
  try {
    const { userId } = req.user;
    const { subscriptionId } = req.params;
    
    const subscription = await DataSubscription.findOne({
      _id: subscriptionId,
      userId
    });
    
    if (!subscription) {
      return res.status(404).json({ error: '订阅不存在' });
    }
    
    subscription.status = 'cancelled';
    await subscription.save();
    
    res.json({
      success: true,
      message: '订阅已取消'
    });
    
  } catch (error) {
    console.error('取消订阅失败:', error);
    res.status(500).json({ error: '取消订阅失败' });
  }
});

module.exports = router;

