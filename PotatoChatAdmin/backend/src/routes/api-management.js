const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// API监控记录模型
const apiMonitorSchema = new mongoose.Schema({
  apiId: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  statusCode: {
    type: Number,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  errorMessage: String,
  requestSize: Number,
  responseSize: Number,
  userAgent: String,
  ipAddress: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ApiMonitor = mongoose.model('ApiMonitor', apiMonitorSchema);

// API配置模型
const apiConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true,
    unique: true
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: true
  },
  description: String,
  version: {
    type: String,
    default: 'v1.0'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rateLimit: {
    requests: { type: Number, default: 1000 },
    window: { type: String, default: 'hour' }
  },
  authentication: {
    required: { type: Boolean, default: true },
    type: { type: String, enum: ['jwt', 'apikey', 'oauth'], default: 'jwt' }
  },
  monitoring: {
    enabled: { type: Boolean, default: true },
    alertThreshold: {
      responseTime: { type: Number, default: 1000 },
      errorRate: { type: Number, default: 5 }
    }
  },
  documentation: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ApiConfig = mongoose.model('ApiConfig', apiConfigSchema);

// API使用统计模型
const apiStatsSchema = new mongoose.Schema({
  apiId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalRequests: {
    type: Number,
    default: 0
  },
  successfulRequests: {
    type: Number,
    default: 0
  },
  failedRequests: {
    type: Number,
    default: 0
  },
  avgResponseTime: {
    type: Number,
    default: 0
  },
  maxResponseTime: {
    type: Number,
    default: 0
  },
  minResponseTime: {
    type: Number,
    default: 0
  },
  totalDataTransfer: {
    type: Number,
    default: 0
  },
  uniqueUsers: {
    type: Number,
    default: 0
  }
});

const ApiStats = mongoose.model('ApiStats', apiStatsSchema);

// 获取所有API列表
router.get('/apis', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { endpoint: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const apis = await ApiConfig.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ApiConfig.countDocuments(query);

    // 获取每个API的实时统计
    const apisWithStats = await Promise.all(apis.map(async (api) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // 获取今日统计
      const todayStats = await ApiMonitor.aggregate([
        {
          $match: {
            apiId: api._id.toString(),
            timestamp: { $gte: today }
          }
        },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: 1 },
            successfulRequests: { $sum: { $cond: ['$success', 1, 0] } },
            failedRequests: { $sum: { $cond: ['$success', 0, 1] } },
            avgResponseTime: { $avg: '$responseTime' },
            maxResponseTime: { $max: '$responseTime' },
            minResponseTime: { $min: '$responseTime' }
          }
        }
      ]);

      // 计算可用性（最近24小时）
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const uptimeStats = await ApiMonitor.aggregate([
        {
          $match: {
            apiId: api._id.toString(),
            timestamp: { $gte: last24Hours }
          }
        },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: 1 },
            successfulRequests: { $sum: { $cond: ['$success', 1, 0] } }
          }
        }
      ]);

      const stats = todayStats[0] || {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        avgResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0
      };

      const uptime = uptimeStats[0] 
        ? (uptimeStats[0].successfulRequests / uptimeStats[0].totalRequests * 100)
        : 100;

      // 确定API状态
      let status = 'healthy';
      if (!api.isActive) {
        status = 'maintenance';
      } else if (stats.avgResponseTime > api.monitoring.alertThreshold.responseTime) {
        status = 'warning';
      } else if (uptime < 95) {
        status = 'error';
      }

      return {
        ...api.toObject(),
        stats: {
          ...stats,
          uptime: Math.round(uptime * 10) / 10,
          errorRate: stats.totalRequests > 0 
            ? Math.round((stats.failedRequests / stats.totalRequests) * 100 * 10) / 10 
            : 0
        },
        status,
        lastChecked: new Date()
      };
    }));

    res.json({
      success: true,
      data: apisWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('获取API列表失败:', error);
    res.status(500).json({ error: '获取API列表失败' });
  }
});

// 获取API详细信息
router.get('/apis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { timeRange = '24h' } = req.query;

    const api = await ApiConfig.findById(id);
    if (!api) {
      return res.status(404).json({ error: 'API不存在' });
    }

    // 计算时间范围
    let startTime;
    switch (timeRange) {
      case '1h':
        startTime = new Date(Date.now() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    // 获取详细统计
    const detailedStats = await ApiMonitor.aggregate([
      {
        $match: {
          apiId: id,
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timeRange === '1h' ? '%Y-%m-%d %H:%M' : '%Y-%m-%d %H',
              date: '$timestamp'
            }
          },
          requests: { $sum: 1 },
          successfulRequests: { $sum: { $cond: ['$success', 1, 0] } },
          failedRequests: { $sum: { $cond: ['$success', 0, 1] } },
          avgResponseTime: { $avg: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' },
          totalDataTransfer: { $sum: { $add: ['$requestSize', '$responseSize'] } }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // 获取错误分析
    const errorAnalysis = await ApiMonitor.aggregate([
      {
        $match: {
          apiId: id,
          success: false,
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: '$statusCode',
          count: { $sum: 1 },
          examples: { $push: '$errorMessage' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // 获取最近的请求日志
    const recentLogs = await ApiMonitor.find({
      apiId: id
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .select('timestamp responseTime statusCode success errorMessage ipAddress');

    res.json({
      success: true,
      data: {
        api: api.toObject(),
        stats: detailedStats,
        errorAnalysis,
        recentLogs
      }
    });

  } catch (error) {
    console.error('获取API详情失败:', error);
    res.status(500).json({ error: '获取API详情失败' });
  }
});

// 创建新API配置
router.post('/apis', async (req, res) => {
  try {
    const apiData = req.body;
    apiData.updatedAt = new Date();

    const api = new ApiConfig(apiData);
    await api.save();

    res.json({
      success: true,
      data: api
    });

  } catch (error) {
    console.error('创建API配置失败:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'API端点已存在' });
    } else {
      res.status(500).json({ error: '创建API配置失败' });
    }
  }
});

// 更新API配置
router.put('/apis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedAt = new Date();

    const api = await ApiConfig.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!api) {
      return res.status(404).json({ error: 'API不存在' });
    }

    res.json({
      success: true,
      data: api
    });

  } catch (error) {
    console.error('更新API配置失败:', error);
    res.status(500).json({ error: '更新API配置失败' });
  }
});

// 删除API配置
router.delete('/apis/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const api = await ApiConfig.findByIdAndDelete(id);
    if (!api) {
      return res.status(404).json({ error: 'API不存在' });
    }

    // 删除相关的监控记录
    await ApiMonitor.deleteMany({ apiId: id });
    await ApiStats.deleteMany({ apiId: id });

    res.json({
      success: true,
      message: 'API配置已删除'
    });

  } catch (error) {
    console.error('删除API配置失败:', error);
    res.status(500).json({ error: '删除API配置失败' });
  }
});

// 记录API调用
router.post('/monitor', async (req, res) => {
  try {
    const {
      apiId,
      endpoint,
      method,
      responseTime,
      statusCode,
      success,
      errorMessage,
      requestSize,
      responseSize,
      userAgent,
      ipAddress
    } = req.body;

    const monitor = new ApiMonitor({
      apiId,
      endpoint,
      method,
      responseTime,
      statusCode,
      success,
      errorMessage,
      requestSize,
      responseSize,
      userAgent,
      ipAddress
    });

    await monitor.save();

    // 检查是否需要发送告警
    const api = await ApiConfig.findById(apiId);
    if (api && api.monitoring.enabled) {
      if (responseTime > api.monitoring.alertThreshold.responseTime) {
        // 发送响应时间告警
        console.log(`API响应时间告警: ${endpoint} 响应时间 ${responseTime}ms 超过阈值 ${api.monitoring.alertThreshold.responseTime}ms`);
      }
      
      if (!success) {
        // 记录错误
        console.log(`API错误: ${endpoint} 状态码 ${statusCode} 错误信息: ${errorMessage}`);
      }
    }

    res.json({
      success: true,
      message: '监控记录已保存'
    });

  } catch (error) {
    console.error('记录API监控失败:', error);
    res.status(500).json({ error: '记录API监控失败' });
  }
});

// 获取API统计概览
router.get('/stats/overview', async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;

    let startTime;
    switch (timeRange) {
      case '1h':
        startTime = new Date(Date.now() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    // 总体统计
    const overallStats = await ApiMonitor.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          successfulRequests: { $sum: { $cond: ['$success', 1, 0] } },
          failedRequests: { $sum: { $cond: ['$success', 0, 1] } },
          avgResponseTime: { $avg: '$responseTime' },
          totalDataTransfer: { $sum: { $add: ['$requestSize', '$responseSize'] } }
        }
      }
    ]);

    // 按API分组统计
    const apiStats = await ApiMonitor.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: '$apiId',
          requests: { $sum: 1 },
          successfulRequests: { $sum: { $cond: ['$success', 1, 0] } },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      {
        $sort: { requests: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // 时间序列统计
    const timeSeriesStats = await ApiMonitor.aggregate([
      {
        $match: {
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timeRange === '1h' ? '%Y-%m-%d %H:%M' : '%Y-%m-%d %H',
              date: '$timestamp'
            }
          },
          requests: { $sum: 1 },
          successfulRequests: { $sum: { $cond: ['$success', 1, 0] } },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const stats = overallStats[0] || {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      totalDataTransfer: 0
    };

    res.json({
      success: true,
      data: {
        overview: {
          ...stats,
          successRate: stats.totalRequests > 0 
            ? Math.round((stats.successfulRequests / stats.totalRequests) * 100 * 10) / 10 
            : 100
        },
        topApis: apiStats,
        timeSeries: timeSeriesStats
      }
    });

  } catch (error) {
    console.error('获取API统计概览失败:', error);
    res.status(500).json({ error: '获取API统计概览失败' });
  }
});

// 测试API连通性
router.post('/test/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const api = await ApiConfig.findById(id);
    if (!api) {
      return res.status(404).json({ error: 'API不存在' });
    }

    // 这里可以实现实际的API测试逻辑
    // 模拟测试结果
    const testResult = {
      success: Math.random() > 0.1, // 90%成功率
      responseTime: Math.floor(Math.random() * 500) + 50,
      statusCode: Math.random() > 0.1 ? 200 : 500,
      timestamp: new Date()
    };

    res.json({
      success: true,
      data: testResult
    });

  } catch (error) {
    console.error('API测试失败:', error);
    res.status(500).json({ error: 'API测试失败' });
  }
});

module.exports = router;

