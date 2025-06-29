const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 订阅计划模型
const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  interval: {
    type: String,
    enum: ['month', 'year'],
    default: 'month'
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  maxUsers: Number,
  apiCallsLimit: Number,
  storageLimit: Number,
  supportLevel: {
    type: String,
    enum: ['basic', 'priority', 'premium'],
    default: 'basic'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

// 用户订阅模型
const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'paused'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  nextBillingDate: Date,
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'crypto', 'bank_transfer']
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  discountCode: String,
  discountAmount: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

// 收入记录模型
const revenueRecordSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['subscription', 'trading_fees', 'advertising', 'ai_strategies', 'data_services', 'virtual_goods'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSubscription'
  },
  transactionId: String,
  description: String,
  metadata: {
    planName: String,
    tradingPair: String,
    adCampaign: String,
    strategyType: String,
    dataType: String,
    itemName: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RevenueRecord = mongoose.model('RevenueRecord', revenueRecordSchema);

// 商业指标模型
const businessMetricsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  metrics: {
    totalRevenue: { type: Number, default: 0 },
    subscriptionRevenue: { type: Number, default: 0 },
    tradingRevenue: { type: Number, default: 0 },
    advertisingRevenue: { type: Number, default: 0 },
    aiStrategyRevenue: { type: Number, default: 0 },
    dataServiceRevenue: { type: Number, default: 0 },
    virtualGoodsRevenue: { type: Number, default: 0 },
    
    activeSubscribers: { type: Number, default: 0 },
    newSubscribers: { type: Number, default: 0 },
    churnedSubscribers: { type: Number, default: 0 },
    upgradedSubscribers: { type: Number, default: 0 },
    downgradedSubscribers: { type: Number, default: 0 },
    
    totalTrades: { type: Number, default: 0 },
    tradingVolume: { type: Number, default: 0 },
    avgTradeSize: { type: Number, default: 0 },
    
    adImpressions: { type: Number, default: 0 },
    adClicks: { type: Number, default: 0 },
    adRevenue: { type: Number, default: 0 },
    
    apiCalls: { type: Number, default: 0 },
    dataRequests: { type: Number, default: 0 },
    
    virtualGoodsSales: { type: Number, default: 0 },
    avgOrderValue: { type: Number, default: 0 }
  },
  calculatedMetrics: {
    churnRate: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    arpu: { type: Number, default: 0 }, // Average Revenue Per User
    ltv: { type: Number, default: 0 }, // Lifetime Value
    cac: { type: Number, default: 0 }, // Customer Acquisition Cost
    mrr: { type: Number, default: 0 }, // Monthly Recurring Revenue
    arr: { type: Number, default: 0 }, // Annual Recurring Revenue
    nrr: { type: Number, default: 0 }  // Net Revenue Retention
  }
});

const BusinessMetrics = mongoose.model('BusinessMetrics', businessMetricsSchema);

// 获取收入概览
router.get('/revenue/overview', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // 计算时间范围
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // 获取收入数据
    const revenueData = await RevenueRecord.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$source',
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // 获取时间序列数据
    const timeSeriesData = await RevenueRecord.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: timeRange === '7d' ? '%Y-%m-%d' : '%Y-%m',
                date: '$date'
              }
            },
            source: '$source'
          },
          revenue: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          sources: {
            $push: {
              source: '$_id.source',
              revenue: '$revenue'
            }
          },
          totalRevenue: { $sum: '$revenue' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // 计算总收入和增长率
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
    
    // 获取上期数据用于计算增长率
    const prevStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const prevRevenueData = await RevenueRecord.aggregate([
      {
        $match: {
          date: { $gte: prevStartDate, $lt: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' }
        }
      }
    ]);

    const prevTotalRevenue = prevRevenueData[0]?.totalRevenue || 0;
    const growthRate = prevTotalRevenue > 0 
      ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue * 100)
      : 0;

    // 获取订阅指标
    const activeSubscribers = await UserSubscription.countDocuments({ status: 'active' });
    const newSubscribers = await UserSubscription.countDocuments({
      createdAt: { $gte: startDate },
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          growthRate: Math.round(growthRate * 10) / 10,
          activeSubscribers,
          newSubscribers
        },
        revenueBySource: revenueData,
        timeSeries: timeSeriesData
      }
    });

  } catch (error) {
    console.error('获取收入概览失败:', error);
    res.status(500).json({ error: '获取收入概览失败' });
  }
});

// 获取订阅服务数据
router.get('/subscriptions', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
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
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // 获取订阅计划数据
    const plans = await SubscriptionPlan.find({ isActive: true });
    
    // 获取每个计划的订阅者数量和收入
    const planMetrics = await Promise.all(plans.map(async (plan) => {
      const subscribers = await UserSubscription.countDocuments({
        planId: plan._id,
        status: 'active'
      });
      
      const revenue = await RevenueRecord.aggregate([
        {
          $match: {
            source: 'subscription',
            'metadata.planName': plan.name,
            date: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' }
          }
        }
      ]);

      return {
        ...plan.toObject(),
        subscribers,
        revenue: revenue[0]?.totalRevenue || 0
      };
    }));

    // 计算订阅指标
    const totalActiveSubscribers = await UserSubscription.countDocuments({ status: 'active' });
    const newSubscribers = await UserSubscription.countDocuments({
      createdAt: { $gte: startDate },
      status: 'active'
    });
    const churnedSubscribers = await UserSubscription.countDocuments({
      status: 'cancelled',
      updatedAt: { $gte: startDate }
    });

    const churnRate = totalActiveSubscribers > 0 
      ? (churnedSubscribers / totalActiveSubscribers * 100)
      : 0;

    // 计算MRR
    const mrr = await RevenueRecord.aggregate([
      {
        $match: {
          source: 'subscription',
          date: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' }
        }
      }
    ]);

    const monthlyRecurringRevenue = mrr[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        plans: planMetrics,
        metrics: {
          totalActiveSubscribers,
          newSubscribers,
          churnedSubscribers,
          churnRate: Math.round(churnRate * 10) / 10,
          monthlyRecurringRevenue
        }
      }
    });

  } catch (error) {
    console.error('获取订阅数据失败:', error);
    res.status(500).json({ error: '获取订阅数据失败' });
  }
});

// 获取交易手续费数据
router.get('/trading', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
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
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // 获取交易手续费收入
    const tradingRevenue = await RevenueRecord.aggregate([
      {
        $match: {
          source: 'trading_fees',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTrades: { $sum: 1 }
        }
      }
    ]);

    // 按交易对分组统计
    const tradingPairStats = await RevenueRecord.aggregate([
      {
        $match: {
          source: 'trading_fees',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$metadata.tradingPair',
          revenue: { $sum: '$amount' },
          trades: { $sum: 1 }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // 时间序列数据
    const timeSeriesData = await RevenueRecord.aggregate([
      {
        $match: {
          source: 'trading_fees',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timeRange === '7d' ? '%Y-%m-%d' : '%Y-%m-%d',
              date: '$date'
            }
          },
          revenue: { $sum: '$amount' },
          trades: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const metrics = tradingRevenue[0] || { totalRevenue: 0, totalTrades: 0 };
    const avgTradeSize = metrics.totalTrades > 0 
      ? metrics.totalRevenue / metrics.totalTrades 
      : 0;

    res.json({
      success: true,
      data: {
        metrics: {
          ...metrics,
          avgTradeSize: Math.round(avgTradeSize * 100) / 100
        },
        tradingPairStats,
        timeSeries: timeSeriesData
      }
    });

  } catch (error) {
    console.error('获取交易数据失败:', error);
    res.status(500).json({ error: '获取交易数据失败' });
  }
});

// 创建订阅计划
router.post('/subscriptions/plans', async (req, res) => {
  try {
    const planData = req.body;
    planData.updatedAt = new Date();

    const plan = new SubscriptionPlan(planData);
    await plan.save();

    res.json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error('创建订阅计划失败:', error);
    res.status(500).json({ error: '创建订阅计划失败' });
  }
});

// 更新订阅计划
router.put('/subscriptions/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedAt = new Date();

    const plan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ error: '订阅计划不存在' });
    }

    res.json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error('更新订阅计划失败:', error);
    res.status(500).json({ error: '更新订阅计划失败' });
  }
});

// 记录收入
router.post('/revenue', async (req, res) => {
  try {
    const revenueData = req.body;
    
    const revenue = new RevenueRecord(revenueData);
    await revenue.save();

    res.json({
      success: true,
      data: revenue
    });

  } catch (error) {
    console.error('记录收入失败:', error);
    res.status(500).json({ error: '记录收入失败' });
  }
});

// 获取商业指标
router.get('/metrics', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
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
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const metrics = await BusinessMetrics.find({
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // 计算汇总指标
    const summary = metrics.reduce((acc, metric) => {
      Object.keys(metric.metrics).forEach(key => {
        acc[key] = (acc[key] || 0) + metric.metrics[key];
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        summary,
        timeSeries: metrics,
        latest: metrics[metrics.length - 1] || null
      }
    });

  } catch (error) {
    console.error('获取商业指标失败:', error);
    res.status(500).json({ error: '获取商业指标失败' });
  }
});

// 更新商业指标
router.post('/metrics', async (req, res) => {
  try {
    const { date, metrics } = req.body;
    
    // 计算衍生指标
    const calculatedMetrics = {
      churnRate: metrics.churnedSubscribers / (metrics.activeSubscribers || 1) * 100,
      arpu: metrics.totalRevenue / (metrics.activeSubscribers || 1),
      mrr: metrics.subscriptionRevenue,
      arr: metrics.subscriptionRevenue * 12
    };

    const businessMetrics = await BusinessMetrics.findOneAndUpdate(
      { date: new Date(date) },
      { 
        metrics,
        calculatedMetrics
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    res.json({
      success: true,
      data: businessMetrics
    });

  } catch (error) {
    console.error('更新商业指标失败:', error);
    res.status(500).json({ error: '更新商业指标失败' });
  }
});

// 获取收入预测
router.get('/forecast', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // 获取历史数据
    const historicalData = await RevenueRecord.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$date'
            }
          },
          totalRevenue: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // 简单的线性预测（实际应用中可以使用更复杂的算法）
    const revenues = historicalData.map(item => item.totalRevenue);
    const avgGrowthRate = revenues.length > 1 
      ? revenues.reduce((acc, curr, index) => {
          if (index === 0) return acc;
          return acc + (curr - revenues[index - 1]) / revenues[index - 1];
        }, 0) / (revenues.length - 1)
      : 0.1; // 默认10%增长率

    const lastRevenue = revenues[revenues.length - 1] || 0;
    
    const forecast = {
      nextMonth: lastRevenue * (1 + avgGrowthRate),
      nextQuarter: lastRevenue * Math.pow(1 + avgGrowthRate, 3),
      nextYear: lastRevenue * Math.pow(1 + avgGrowthRate, 12)
    };

    res.json({
      success: true,
      data: {
        forecast,
        growthRate: Math.round(avgGrowthRate * 100 * 10) / 10,
        historicalData
      }
    });

  } catch (error) {
    console.error('获取收入预测失败:', error);
    res.status(500).json({ error: '获取收入预测失败' });
  }
});

module.exports = router;

