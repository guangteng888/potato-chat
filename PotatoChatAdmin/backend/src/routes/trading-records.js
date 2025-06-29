const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 交易记录模型
const tradingRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalValue: {
    type: Number,
    required: true,
    min: 0
  },
  fee: {
    type: Number,
    required: true,
    min: 0
  },
  feeRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  executionTime: {
    type: Number,
    min: 0
  },
  failureReason: String,
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  isAnomalous: {
    type: Boolean,
    default: false
  },
  anomalyReasons: [String],
  ipAddress: String,
  userAgent: String,
  deviceInfo: {
    platform: String,
    browser: String,
    version: String
  },
  marketData: {
    marketPrice: Number,
    priceDeviation: Number,
    volume24h: Number,
    volatility: Number
  },
  compliance: {
    kycVerified: Boolean,
    amlChecked: Boolean,
    riskScore: Number,
    sanctionChecked: Boolean
  },
  metadata: {
    source: String,
    referenceId: String,
    notes: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  cancelledAt: Date
});

// 添加索引
tradingRecordSchema.index({ userId: 1, createdAt: -1 });
tradingRecordSchema.index({ symbol: 1, createdAt: -1 });
tradingRecordSchema.index({ status: 1, createdAt: -1 });
tradingRecordSchema.index({ isAnomalous: 1, createdAt: -1 });
tradingRecordSchema.index({ orderId: 1 });

const TradingRecord = mongoose.model('TradingRecord', tradingRecordSchema);

// 交易统计模型
const tradingStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  symbol: String,
  totalTrades: {
    type: Number,
    default: 0
  },
  totalVolume: {
    type: Number,
    default: 0
  },
  totalFees: {
    type: Number,
    default: 0
  },
  buyTrades: {
    type: Number,
    default: 0
  },
  sellTrades: {
    type: Number,
    default: 0
  },
  buyVolume: {
    type: Number,
    default: 0
  },
  sellVolume: {
    type: Number,
    default: 0
  },
  avgTradeSize: {
    type: Number,
    default: 0
  },
  avgExecutionTime: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  anomalousCount: {
    type: Number,
    default: 0
  },
  uniqueUsers: {
    type: Number,
    default: 0
  }
});

const TradingStats = mongoose.model('TradingStats', tradingStatsSchema);

// 获取交易记录列表
router.get('/records', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      symbol,
      userId,
      minAmount,
      maxAmount,
      dateRange,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // 构建查询条件
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (symbol) {
      query.symbol = { $regex: symbol, $options: 'i' };
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    if (minAmount || maxAmount) {
      query.totalValue = {};
      if (minAmount) query.totalValue.$gte = parseFloat(minAmount);
      if (maxAmount) query.totalValue.$lte = parseFloat(maxAmount);
    }
    
    // 日期范围过滤
    if (dateRange) {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case '1d':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }
    
    // 搜索条件
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { symbol: { $regex: search, $options: 'i' } }
      ];
    }

    // 排序条件
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // 执行查询
    const records = await TradingRecord.find(query)
      .populate('userId', 'username email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await TradingRecord.countDocuments(query);

    // 添加用户信息
    const recordsWithUserInfo = records.map(record => ({
      ...record,
      username: record.userId?.username || 'Unknown',
      userEmail: record.userId?.email || 'Unknown'
    }));

    res.json({
      success: true,
      data: recordsWithUserInfo,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('获取交易记录失败:', error);
    res.status(500).json({ error: '获取交易记录失败' });
  }
});

// 获取交易记录详情
router.get('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const record = await TradingRecord.findById(id)
      .populate('userId', 'username email profile')
      .lean();

    if (!record) {
      return res.status(404).json({ error: '交易记录不存在' });
    }

    // 获取相关交易记录
    const relatedRecords = await TradingRecord.find({
      userId: record.userId._id,
      _id: { $ne: id }
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('orderId type symbol amount totalValue status createdAt')
    .lean();

    res.json({
      success: true,
      data: {
        record,
        relatedRecords
      }
    });

  } catch (error) {
    console.error('获取交易记录详情失败:', error);
    res.status(500).json({ error: '获取交易记录详情失败' });
  }
});

// 获取交易统计
router.get('/stats', async (req, res) => {
  try {
    const { timeRange = '7d', symbol } = req.query;

    // 计算时间范围
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    let matchCondition = { createdAt: { $gte: startDate } };
    if (symbol) {
      matchCondition.symbol = symbol;
    }

    // 总体统计
    const overallStats = await TradingRecord.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          completedRecords: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pendingRecords: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          failedRecords: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          totalVolume: { $sum: '$totalValue' },
          totalFees: { $sum: '$fee' },
          avgExecutionTime: { $avg: '$executionTime' },
          anomalousRecords: { $sum: { $cond: ['$isAnomalous', 1, 0] } },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          totalRecords: 1,
          completedRecords: 1,
          pendingRecords: 1,
          failedRecords: 1,
          totalVolume: 1,
          totalFees: 1,
          avgExecutionTime: 1,
          anomalousRecords: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          successRate: {
            $cond: [
              { $gt: ['$totalRecords', 0] },
              { $multiply: [{ $divide: ['$completedRecords', '$totalRecords'] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    // 按交易对统计
    const symbolStats = await TradingRecord.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$symbol',
          totalTrades: { $sum: 1 },
          totalVolume: { $sum: '$totalValue' },
          totalFees: { $sum: '$fee' },
          buyTrades: { $sum: { $cond: [{ $eq: ['$type', 'buy'] }, 1, 0] } },
          sellTrades: { $sum: { $cond: [{ $eq: ['$type', 'sell'] }, 1, 0] } },
          avgTradeSize: { $avg: '$totalValue' }
        }
      },
      { $sort: { totalVolume: -1 } },
      { $limit: 10 }
    ]);

    // 时间序列统计
    const timeSeriesStats = await TradingRecord.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timeRange === '1d' ? '%Y-%m-%d %H:00' : '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          trades: { $sum: 1 },
          volume: { $sum: '$totalValue' },
          fees: { $sum: '$fee' },
          completedTrades: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // 风险分析
    const riskAnalysis = await TradingRecord.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 },
          totalVolume: { $sum: '$totalValue' },
          anomalousCount: { $sum: { $cond: ['$isAnomalous', 1, 0] } }
        }
      }
    ]);

    // 异常交易分析
    const anomalyAnalysis = await TradingRecord.aggregate([
      { 
        $match: { 
          ...matchCondition,
          isAnomalous: true 
        } 
      },
      {
        $group: {
          _id: { $arrayElemAt: ['$anomalyReasons', 0] },
          count: { $sum: 1 },
          totalVolume: { $sum: '$totalValue' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const stats = overallStats[0] || {
      totalRecords: 0,
      completedRecords: 0,
      pendingRecords: 0,
      failedRecords: 0,
      totalVolume: 0,
      totalFees: 0,
      avgExecutionTime: 0,
      anomalousRecords: 0,
      uniqueUsers: 0,
      successRate: 0
    };

    res.json({
      success: true,
      data: {
        overview: stats,
        symbolStats,
        timeSeries: timeSeriesStats,
        riskAnalysis,
        anomalyAnalysis
      }
    });

  } catch (error) {
    console.error('获取交易统计失败:', error);
    res.status(500).json({ error: '获取交易统计失败' });
  }
});

// 创建交易记录
router.post('/records', async (req, res) => {
  try {
    const recordData = req.body;
    
    // 生成唯一订单ID
    if (!recordData.orderId) {
      recordData.orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 计算总价值和手续费
    recordData.totalValue = recordData.amount * recordData.price;
    recordData.fee = recordData.totalValue * (recordData.feeRate / 100);

    // 风险评估
    recordData.riskLevel = assessRiskLevel(recordData);
    recordData.isAnomalous = await detectAnomalies(recordData);

    const record = new TradingRecord(recordData);
    await record.save();

    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    console.error('创建交易记录失败:', error);
    res.status(500).json({ error: '创建交易记录失败' });
  }
});

// 更新交易记录状态
router.put('/records/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, failureReason, executionTime } = req.body;

    const updateData = { 
      status, 
      updatedAt: new Date() 
    };

    if (status === 'completed') {
      updateData.completedAt = new Date();
      if (executionTime) {
        updateData.executionTime = executionTime;
      }
    } else if (status === 'failed') {
      updateData.failureReason = failureReason;
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    const record = await TradingRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ error: '交易记录不存在' });
    }

    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    console.error('更新交易记录状态失败:', error);
    res.status(500).json({ error: '更新交易记录状态失败' });
  }
});

// 标记异常交易
router.put('/records/:id/anomaly', async (req, res) => {
  try {
    const { id } = req.params;
    const { isAnomalous, anomalyReasons } = req.body;

    const record = await TradingRecord.findByIdAndUpdate(
      id,
      { 
        isAnomalous,
        anomalyReasons: anomalyReasons || [],
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ error: '交易记录不存在' });
    }

    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    console.error('标记异常交易失败:', error);
    res.status(500).json({ error: '标记异常交易失败' });
  }
});

// 获取异常交易列表
router.get('/anomalies', async (req, res) => {
  try {
    const { page = 1, limit = 20, timeRange = '7d' } = req.query;

    // 计算时间范围
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const query = {
      isAnomalous: true,
      createdAt: { $gte: startDate }
    };

    const anomalies = await TradingRecord.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await TradingRecord.countDocuments(query);

    res.json({
      success: true,
      data: anomalies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('获取异常交易列表失败:', error);
    res.status(500).json({ error: '获取异常交易列表失败' });
  }
});

// 导出交易记录
router.get('/export', async (req, res) => {
  try {
    const { format = 'csv', ...filters } = req.query;

    // 构建查询条件（复用获取记录的逻辑）
    let query = {};
    
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    
    if (filters.type && filters.type !== 'all') {
      query.type = filters.type;
    }
    
    if (filters.symbol) {
      query.symbol = { $regex: filters.symbol, $options: 'i' };
    }

    // 限制导出数量
    const records = await TradingRecord.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(10000) // 最多导出10000条
      .lean();

    if (format === 'csv') {
      const csvHeaders = [
        '交易ID', '订单ID', '用户名', '类型', '交易对', '数量', '价格', 
        '总价值', '手续费', '状态', '创建时间', '完成时间'
      ];

      const csvRows = records.map(record => [
        record._id,
        record.orderId,
        record.userId?.username || 'Unknown',
        record.type,
        record.symbol,
        record.amount,
        record.price,
        record.totalValue,
        record.fee,
        record.status,
        record.createdAt.toISOString(),
        record.completedAt ? record.completedAt.toISOString() : ''
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=trading_records.csv');
      res.send(csvContent);
    } else {
      res.json({
        success: true,
        data: records
      });
    }

  } catch (error) {
    console.error('导出交易记录失败:', error);
    res.status(500).json({ error: '导出交易记录失败' });
  }
});

// 风险评估函数
function assessRiskLevel(recordData) {
  let riskScore = 0;

  // 基于交易金额
  if (recordData.totalValue > 100000) riskScore += 3;
  else if (recordData.totalValue > 10000) riskScore += 2;
  else if (recordData.totalValue > 1000) riskScore += 1;

  // 基于用户历史（这里简化处理）
  // 实际应该查询用户历史交易记录

  // 基于市场条件
  if (recordData.marketData?.volatility > 0.1) riskScore += 2;
  if (recordData.marketData?.priceDeviation > 0.05) riskScore += 1;

  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

// 异常检测函数
async function detectAnomalies(recordData) {
  const anomalies = [];

  // 检查异常大额交易
  if (recordData.totalValue > 1000000) {
    anomalies.push('large_amount');
  }

  // 检查价格偏差
  if (recordData.marketData?.priceDeviation > 0.1) {
    anomalies.push('price_deviation');
  }

  // 检查频繁交易（需要查询用户最近交易）
  const recentTrades = await TradingRecord.countDocuments({
    userId: recordData.userId,
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // 最近1小时
  });

  if (recentTrades > 10) {
    anomalies.push('frequent_trading');
  }

  return anomalies.length > 0;
}

module.exports = router;

