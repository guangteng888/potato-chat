const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 交易手续费配置
const FEE_STRUCTURE = {
  spot: {
    name: '现货交易',
    tiers: {
      standard: { rate: 0.002, minVolume: 0 },
      bronze: { rate: 0.0018, minVolume: 10000 },
      silver: { rate: 0.0015, minVolume: 50000 },
      gold: { rate: 0.0012, minVolume: 100000 },
      platinum: { rate: 0.001, minVolume: 500000 },
      diamond: { rate: 0.0008, minVolume: 1000000 }
    }
  },
  futures: {
    name: '期货交易',
    tiers: {
      standard: { rate: 0.0015, minVolume: 0 },
      bronze: { rate: 0.0013, minVolume: 10000 },
      silver: { rate: 0.0011, minVolume: 50000 },
      gold: { rate: 0.0009, minVolume: 100000 },
      platinum: { rate: 0.0007, minVolume: 500000 },
      diamond: { rate: 0.0005, minVolume: 1000000 }
    }
  },
  options: {
    name: '期权交易',
    tiers: {
      standard: { rate: 5, minVolume: 0 },
      bronze: { rate: 4.5, minVolume: 10000 },
      silver: { rate: 4, minVolume: 50000 },
      gold: { rate: 3.5, minVolume: 100000 },
      platinum: { rate: 3, minVolume: 500000 },
      diamond: { rate: 2.5, minVolume: 1000000 }
    }
  },
  forex: {
    name: '外汇交易',
    tiers: {
      standard: { rate: 3, minVolume: 0 },
      bronze: { rate: 2.8, minVolume: 10000 },
      silver: { rate: 2.5, minVolume: 50000 },
      gold: { rate: 2.2, minVolume: 100000 },
      platinum: { rate: 2, minVolume: 500000 },
      diamond: { rate: 1.8, minVolume: 1000000 }
    }
  }
};

// 特殊费率配置
const SPECIAL_RATES = {
  newUser: {
    duration: 30, // 30天
    discount: 1.0, // 100%折扣（免费）
    maxAmount: 10000 // 最大免费交易金额
  },
  referral: {
    referrer: 0.2, // 推荐人获得20%返佣
    referee: 0.2, // 被推荐人获得20%折扣
    duration: 90 // 90天有效期
  },
  institutional: {
    minVolume: 10000000, // 1000万美元
    customRate: true,
    minRate: 0.0005 // 最低费率0.05%
  }
};

// 交易记录模型
const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tradeId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['spot', 'futures', 'options', 'forex'],
    required: true
  },
  side: {
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
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  fee: {
    amount: { type: Number, required: true },
    rate: { type: Number, required: true },
    tier: { type: String, required: true },
    currency: { type: String, default: 'USD' }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    userTier: String,
    monthlyVolume: Number,
    specialDiscount: mongoose.Schema.Types.Mixed,
    referralBonus: mongoose.Schema.Types.Mixed
  }
});

const Trade = mongoose.model('Trade', tradeSchema);

// 用户交易统计模型
const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentTier: {
    type: String,
    enum: ['standard', 'bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'standard'
  },
  monthlyVolume: {
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
  tradeCount: {
    type: Number,
    default: 0
  },
  lastVolumeReset: {
    type: Date,
    default: Date.now
  },
  specialStatus: {
    isNewUser: { type: Boolean, default: true },
    newUserExpiry: Date,
    referralCode: String,
    referredBy: mongoose.Schema.Types.ObjectId,
    isInstitutional: { type: Boolean, default: false },
    customRate: Number
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

const UserStats = mongoose.model('UserStats', userStatsSchema);

// 手续费计算引擎类
class FeeCalculationEngine {
  
  // 计算用户等级
  static determineUserTier(monthlyVolume) {
    const tiers = Object.keys(FEE_STRUCTURE.spot.tiers).reverse();
    for (const tier of tiers) {
      if (monthlyVolume >= FEE_STRUCTURE.spot.tiers[tier].minVolume) {
        return tier;
      }
    }
    return 'standard';
  }

  // 计算基础手续费
  static calculateBaseFee(tradeType, amount, userTier, quantity = 1) {
    const structure = FEE_STRUCTURE[tradeType];
    if (!structure) {
      throw new Error(`不支持的交易类型: ${tradeType}`);
    }

    const tierInfo = structure.tiers[userTier];
    if (!tierInfo) {
      throw new Error(`无效的用户等级: ${userTier}`);
    }

    let fee = 0;
    switch (tradeType) {
      case 'spot':
      case 'futures':
        fee = amount * tierInfo.rate;
        break;
      case 'options':
        fee = quantity * tierInfo.rate;
        break;
      case 'forex':
        // 外汇按点差计算，这里返回点差值
        fee = tierInfo.rate;
        break;
      default:
        throw new Error(`未实现的交易类型: ${tradeType}`);
    }

    return {
      baseFee: fee,
      rate: tierInfo.rate,
      tier: userTier
    };
  }

  // 应用特殊折扣
  static applySpecialDiscounts(baseFee, userStats, tradeAmount) {
    let finalFee = baseFee;
    let discounts = [];

    // 新用户优惠
    if (userStats.specialStatus.isNewUser && 
        userStats.specialStatus.newUserExpiry > new Date()) {
      const remainingFreeAmount = SPECIAL_RATES.newUser.maxAmount - userStats.totalVolume;
      if (remainingFreeAmount > 0) {
        const freeAmount = Math.min(tradeAmount, remainingFreeAmount);
        const freeRatio = freeAmount / tradeAmount;
        const discount = baseFee * freeRatio * SPECIAL_RATES.newUser.discount;
        finalFee -= discount;
        discounts.push({
          type: 'newUser',
          amount: discount,
          description: '新用户免费额度'
        });
      }
    }

    // 推荐折扣
    if (userStats.specialStatus.referredBy) {
      const referralDiscount = baseFee * SPECIAL_RATES.referral.referee;
      finalFee -= referralDiscount;
      discounts.push({
        type: 'referral',
        amount: referralDiscount,
        description: '推荐用户折扣'
      });
    }

    // 机构用户定制费率
    if (userStats.specialStatus.isInstitutional && userStats.specialStatus.customRate) {
      const institutionalFee = tradeAmount * userStats.specialStatus.customRate;
      if (institutionalFee < finalFee) {
        const discount = finalFee - institutionalFee;
        finalFee = institutionalFee;
        discounts.push({
          type: 'institutional',
          amount: discount,
          description: '机构用户定制费率'
        });
      }
    }

    return {
      finalFee: Math.max(0, finalFee),
      discounts
    };
  }

  // 计算推荐返佣
  static calculateReferralBonus(fee, userStats) {
    if (!userStats.specialStatus.referredBy) {
      return null;
    }

    const bonusAmount = fee * SPECIAL_RATES.referral.referrer;
    return {
      referrerId: userStats.specialStatus.referredBy,
      amount: bonusAmount,
      type: 'referral_bonus'
    };
  }

  // 主要计算方法
  static async calculateTradeFee(userId, tradeData) {
    try {
      // 获取用户统计信息
      let userStats = await UserStats.findOne({ userId });
      if (!userStats) {
        userStats = new UserStats({ 
          userId,
          specialStatus: {
            newUserExpiry: new Date(Date.now() + SPECIAL_RATES.newUser.duration * 24 * 60 * 60 * 1000)
          }
        });
        await userStats.save();
      }

      // 检查是否需要重置月度交易量
      const now = new Date();
      const lastReset = userStats.lastVolumeReset;
      const daysSinceReset = Math.floor((now - lastReset) / (24 * 60 * 60 * 1000));
      
      if (daysSinceReset >= 30) {
        userStats.monthlyVolume = 0;
        userStats.lastVolumeReset = now;
        userStats.currentTier = this.determineUserTier(0);
        await userStats.save();
      }

      // 确定用户等级
      const userTier = this.determineUserTier(userStats.monthlyVolume);
      
      // 计算基础手续费
      const { baseFee, rate, tier } = this.calculateBaseFee(
        tradeData.type,
        tradeData.amount,
        userTier,
        tradeData.quantity
      );

      // 应用特殊折扣
      const { finalFee, discounts } = this.applySpecialDiscounts(
        baseFee,
        userStats,
        tradeData.amount
      );

      // 计算推荐返佣
      const referralBonus = this.calculateReferralBonus(finalFee, userStats);

      return {
        fee: {
          amount: finalFee,
          rate: rate,
          tier: tier,
          currency: 'USD'
        },
        baseFee,
        discounts,
        referralBonus,
        userTier,
        monthlyVolume: userStats.monthlyVolume
      };

    } catch (error) {
      console.error('计算手续费失败:', error);
      throw error;
    }
  }
}

// API路由

// 计算手续费（预览）
router.post('/calculate', async (req, res) => {
  try {
    const { userId, tradeData } = req.body;
    
    if (!userId || !tradeData) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const result = await FeeCalculationEngine.calculateTradeFee(userId, tradeData);
    
    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('计算手续费失败:', error);
    res.status(500).json({ error: '计算手续费失败' });
  }
});

// 记录交易并收取手续费
router.post('/record-trade', async (req, res) => {
  try {
    const { userId, tradeData } = req.body;
    
    // 计算手续费
    const feeResult = await FeeCalculationEngine.calculateTradeFee(userId, tradeData);
    
    // 创建交易记录
    const trade = new Trade({
      userId,
      tradeId: tradeData.tradeId || `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: tradeData.type,
      side: tradeData.side,
      symbol: tradeData.symbol,
      amount: tradeData.amount,
      price: tradeData.price,
      quantity: tradeData.quantity || 1,
      fee: feeResult.fee,
      metadata: {
        userTier: feeResult.userTier,
        monthlyVolume: feeResult.monthlyVolume,
        specialDiscount: feeResult.discounts,
        referralBonus: feeResult.referralBonus
      }
    });

    await trade.save();

    // 更新用户统计
    const userStats = await UserStats.findOne({ userId });
    userStats.monthlyVolume += tradeData.amount;
    userStats.totalVolume += tradeData.amount;
    userStats.totalFees += feeResult.fee.amount;
    userStats.tradeCount += 1;
    userStats.currentTier = FeeCalculationEngine.determineUserTier(userStats.monthlyVolume);
    userStats.updatedAt = new Date();
    
    await userStats.save();

    // 处理推荐返佣
    if (feeResult.referralBonus) {
      await this.processReferralBonus(feeResult.referralBonus);
    }

    res.json({
      success: true,
      trade: {
        tradeId: trade.tradeId,
        fee: trade.fee,
        status: trade.status
      },
      userStats: {
        currentTier: userStats.currentTier,
        monthlyVolume: userStats.monthlyVolume,
        totalFees: userStats.totalFees
      }
    });

  } catch (error) {
    console.error('记录交易失败:', error);
    res.status(500).json({ error: '记录交易失败' });
  }
});

// 获取用户费率信息
router.get('/user-rates/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      userStats = new UserStats({ userId });
      await userStats.save();
    }

    const userTier = FeeCalculationEngine.determineUserTier(userStats.monthlyVolume);
    
    const rates = {};
    Object.keys(FEE_STRUCTURE).forEach(tradeType => {
      rates[tradeType] = {
        rate: FEE_STRUCTURE[tradeType].tiers[userTier].rate,
        tier: userTier
      };
    });

    res.json({
      success: true,
      userTier,
      monthlyVolume: userStats.monthlyVolume,
      rates,
      specialStatus: userStats.specialStatus
    });

  } catch (error) {
    console.error('获取用户费率失败:', error);
    res.status(500).json({ error: '获取用户费率失败' });
  }
});

// 获取交易历史和费用统计
router.get('/trade-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, type } = req.query;
    
    const query = { userId };
    if (type) {
      query.type = type;
    }

    const trades = await Trade.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalTrades = await Trade.countDocuments(query);
    const userStats = await UserStats.findOne({ userId });

    res.json({
      success: true,
      trades,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalTrades,
        pages: Math.ceil(totalTrades / limit)
      },
      stats: userStats
    });

  } catch (error) {
    console.error('获取交易历史失败:', error);
    res.status(500).json({ error: '获取交易历史失败' });
  }
});

// 处理推荐返佣
async function processReferralBonus(bonusData) {
  try {
    // 这里可以实现返佣逻辑，比如：
    // 1. 记录返佣记录
    // 2. 更新推荐人账户余额
    // 3. 发送通知
    console.log('处理推荐返佣:', bonusData);
  } catch (error) {
    console.error('处理推荐返佣失败:', error);
  }
}

// 获取费率结构
router.get('/fee-structure', (req, res) => {
  res.json({
    success: true,
    feeStructure: FEE_STRUCTURE,
    specialRates: SPECIAL_RATES
  });
});

module.exports = router;

