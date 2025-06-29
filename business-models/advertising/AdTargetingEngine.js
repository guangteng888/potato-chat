const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 广告活动模型
const adCampaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  advertiserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advertiser',
    required: true
  },
  type: {
    type: String,
    enum: ['banner', 'native', 'video', 'sponsored'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  budget: {
    total: { type: Number, required: true },
    daily: { type: Number },
    spent: { type: Number, default: 0 }
  },
  pricing: {
    model: { type: String, enum: ['cpm', 'cpc', 'cpa'], required: true },
    bid: { type: Number, required: true }
  },
  targeting: {
    demographics: {
      ageGroups: [String],
      genders: [String],
      locations: [String]
    },
    interests: [String],
    tradingBehavior: {
      volumeRange: { min: Number, max: Number },
      tradingTypes: [String],
      experienceLevel: [String]
    },
    deviceTypes: [String],
    timeSchedule: {
      days: [Number], // 0-6 (Sunday-Saturday)
      hours: [Number] // 0-23
    }
  },
  creative: {
    title: String,
    description: String,
    imageUrl: String,
    videoUrl: String,
    clickUrl: String,
    callToAction: String
  },
  schedule: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  performance: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpm: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 }
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

const AdCampaign = mongoose.model('AdCampaign', adCampaignSchema);

// 广告展示记录模型
const adImpressionSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adPlacement: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userProfile: {
    demographics: mongoose.Schema.Types.Mixed,
    interests: [String],
    tradingBehavior: mongoose.Schema.Types.Mixed
  },
  deviceInfo: {
    type: String,
    platform: String,
    userAgent: String
  },
  clicked: {
    type: Boolean,
    default: false
  },
  clickTimestamp: Date,
  converted: {
    type: Boolean,
    default: false
  },
  conversionTimestamp: Date,
  revenue: {
    type: Number,
    default: 0
  }
});

const AdImpression = mongoose.model('AdImpression', adImpressionSchema);

// 用户画像模型
const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  demographics: {
    age: Number,
    gender: String,
    location: {
      country: String,
      region: String,
      city: String
    }
  },
  interests: {
    categories: [String],
    scores: mongoose.Schema.Types.Mixed // category -> score mapping
  },
  tradingBehavior: {
    totalVolume: { type: Number, default: 0 },
    monthlyVolume: { type: Number, default: 0 },
    tradingTypes: [String],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    },
    preferredAssets: [String],
    tradingFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'occasional'],
      default: 'occasional'
    }
  },
  deviceUsage: {
    primaryDevice: String,
    platforms: [String],
    activeHours: [Number]
  },
  engagement: {
    sessionDuration: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    adInteractionRate: { type: Number, default: 0 }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// 广告定向引擎类
class AdTargetingEngine {
  
  // 计算用户与广告的匹配度
  static calculateTargetingScore(userProfile, campaign) {
    let score = 0;
    let maxScore = 0;
    
    const targeting = campaign.targeting;
    
    // 人口统计匹配 (权重: 20%)
    if (targeting.demographics) {
      maxScore += 20;
      
      // 年龄匹配
      if (targeting.demographics.ageGroups && userProfile.demographics.age) {
        const userAge = userProfile.demographics.age;
        const ageMatch = targeting.demographics.ageGroups.some(ageGroup => {
          const [min, max] = ageGroup.split('_').slice(1).map(Number);
          return userAge >= min && userAge <= max;
        });
        if (ageMatch) score += 8;
      }
      
      // 性别匹配
      if (targeting.demographics.genders && userProfile.demographics.gender) {
        if (targeting.demographics.genders.includes(userProfile.demographics.gender)) {
          score += 6;
        }
      }
      
      // 地理位置匹配
      if (targeting.demographics.locations && userProfile.demographics.location) {
        const locationMatch = targeting.demographics.locations.some(location => 
          userProfile.demographics.location.country === location ||
          userProfile.demographics.location.region === location
        );
        if (locationMatch) score += 6;
      }
    }
    
    // 兴趣匹配 (权重: 30%)
    if (targeting.interests && userProfile.interests.categories) {
      maxScore += 30;
      const interestOverlap = targeting.interests.filter(interest => 
        userProfile.interests.categories.includes(interest)
      ).length;
      const interestScore = Math.min(30, (interestOverlap / targeting.interests.length) * 30);
      score += interestScore;
    }
    
    // 交易行为匹配 (权重: 40%)
    if (targeting.tradingBehavior && userProfile.tradingBehavior) {
      maxScore += 40;
      
      // 交易量匹配
      if (targeting.tradingBehavior.volumeRange) {
        const userVolume = userProfile.tradingBehavior.monthlyVolume;
        const { min, max } = targeting.tradingBehavior.volumeRange;
        if (userVolume >= min && userVolume <= max) {
          score += 15;
        }
      }
      
      // 交易类型匹配
      if (targeting.tradingBehavior.tradingTypes) {
        const typeOverlap = targeting.tradingBehavior.tradingTypes.filter(type =>
          userProfile.tradingBehavior.tradingTypes?.includes(type)
        ).length;
        if (typeOverlap > 0) score += 10;
      }
      
      // 经验水平匹配
      if (targeting.tradingBehavior.experienceLevel) {
        if (targeting.tradingBehavior.experienceLevel.includes(
          userProfile.tradingBehavior.experienceLevel
        )) {
          score += 15;
        }
      }
    }
    
    // 设备类型匹配 (权重: 10%)
    if (targeting.deviceTypes && userProfile.deviceUsage.primaryDevice) {
      maxScore += 10;
      if (targeting.deviceTypes.includes(userProfile.deviceUsage.primaryDevice)) {
        score += 10;
      }
    }
    
    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  }
  
  // 获取用户的推荐广告
  static async getRecommendedAds(userId, placement, limit = 5) {
    try {
      // 获取用户画像
      const userProfile = await UserProfile.findOne({ userId });
      if (!userProfile) {
        return [];
      }
      
      // 获取活跃的广告活动
      const activeCampaigns = await AdCampaign.find({
        status: 'active',
        'schedule.startDate': { $lte: new Date() },
        'schedule.endDate': { $gte: new Date() },
        'budget.spent': { $lt: '$budget.total' }
      });
      
      // 计算匹配度并排序
      const scoredAds = activeCampaigns.map(campaign => ({
        campaign,
        score: this.calculateTargetingScore(userProfile, campaign)
      })).filter(item => item.score > 30) // 只返回匹配度大于30%的广告
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      
      return scoredAds;
      
    } catch (error) {
      console.error('获取推荐广告失败:', error);
      return [];
    }
  }
  
  // 记录广告展示
  static async recordImpression(campaignId, userId, placement, deviceInfo) {
    try {
      const userProfile = await UserProfile.findOne({ userId });
      
      const impression = new AdImpression({
        campaignId,
        userId,
        adPlacement: placement,
        userProfile: userProfile ? {
          demographics: userProfile.demographics,
          interests: userProfile.interests.categories,
          tradingBehavior: userProfile.tradingBehavior
        } : null,
        deviceInfo
      });
      
      await impression.save();
      
      // 更新活动统计
      await AdCampaign.updateOne(
        { campaignId },
        { 
          $inc: { 'performance.impressions': 1 },
          $set: { updatedAt: new Date() }
        }
      );
      
      return impression;
      
    } catch (error) {
      console.error('记录广告展示失败:', error);
      throw error;
    }
  }
  
  // 记录广告点击
  static async recordClick(impressionId) {
    try {
      const impression = await AdImpression.findById(impressionId);
      if (!impression) {
        throw new Error('展示记录不存在');
      }
      
      impression.clicked = true;
      impression.clickTimestamp = new Date();
      await impression.save();
      
      // 更新活动统计
      await AdCampaign.updateOne(
        { campaignId: impression.campaignId },
        { 
          $inc: { 'performance.clicks': 1 },
          $set: { updatedAt: new Date() }
        }
      );
      
      // 重新计算CTR
      const campaign = await AdCampaign.findOne({ campaignId: impression.campaignId });
      if (campaign && campaign.performance.impressions > 0) {
        const ctr = (campaign.performance.clicks / campaign.performance.impressions) * 100;
        await AdCampaign.updateOne(
          { campaignId: impression.campaignId },
          { $set: { 'performance.ctr': ctr } }
        );
      }
      
      return impression;
      
    } catch (error) {
      console.error('记录广告点击失败:', error);
      throw error;
    }
  }
  
  // 更新用户画像
  static async updateUserProfile(userId, profileData) {
    try {
      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { 
          ...profileData,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
      
      return profile;
      
    } catch (error) {
      console.error('更新用户画像失败:', error);
      throw error;
    }
  }
}

// API路由

// 获取推荐广告
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { placement = 'default', limit = 5 } = req.query;
    
    const recommendations = await AdTargetingEngine.getRecommendedAds(
      userId, 
      placement, 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      recommendations: recommendations.map(item => ({
        campaignId: item.campaign.campaignId,
        name: item.campaign.name,
        type: item.campaign.type,
        creative: item.campaign.creative,
        score: item.score
      }))
    });
    
  } catch (error) {
    console.error('获取推荐广告失败:', error);
    res.status(500).json({ error: '获取推荐广告失败' });
  }
});

// 记录广告展示
router.post('/impression', async (req, res) => {
  try {
    const { campaignId, userId, placement, deviceInfo } = req.body;
    
    const impression = await AdTargetingEngine.recordImpression(
      campaignId,
      userId,
      placement,
      deviceInfo
    );
    
    res.json({
      success: true,
      impressionId: impression._id
    });
    
  } catch (error) {
    console.error('记录广告展示失败:', error);
    res.status(500).json({ error: '记录广告展示失败' });
  }
});

// 记录广告点击
router.post('/click', async (req, res) => {
  try {
    const { impressionId } = req.body;
    
    const impression = await AdTargetingEngine.recordClick(impressionId);
    
    res.json({
      success: true,
      clickUrl: impression.campaign?.creative?.clickUrl
    });
    
  } catch (error) {
    console.error('记录广告点击失败:', error);
    res.status(500).json({ error: '记录广告点击失败' });
  }
});

// 更新用户画像
router.post('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;
    
    const profile = await AdTargetingEngine.updateUserProfile(userId, profileData);
    
    res.json({
      success: true,
      profile
    });
    
  } catch (error) {
    console.error('更新用户画像失败:', error);
    res.status(500).json({ error: '更新用户画像失败' });
  }
});

// 获取广告活动列表
router.get('/campaigns', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    
    const campaigns = await AdCampaign.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await AdCampaign.countDocuments(query);
    
    res.json({
      success: true,
      campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('获取广告活动失败:', error);
    res.status(500).json({ error: '获取广告活动失败' });
  }
});

// 创建广告活动
router.post('/campaigns', async (req, res) => {
  try {
    const campaignData = req.body;
    campaignData.campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const campaign = new AdCampaign(campaignData);
    await campaign.save();
    
    res.json({
      success: true,
      campaign
    });
    
  } catch (error) {
    console.error('创建广告活动失败:', error);
    res.status(500).json({ error: '创建广告活动失败' });
  }
});

// 更新广告活动
router.put('/campaigns/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updateData = req.body;
    updateData.updatedAt = new Date();
    
    const campaign = await AdCampaign.findOneAndUpdate(
      { campaignId },
      updateData,
      { new: true }
    );
    
    if (!campaign) {
      return res.status(404).json({ error: '广告活动不存在' });
    }
    
    res.json({
      success: true,
      campaign
    });
    
  } catch (error) {
    console.error('更新广告活动失败:', error);
    res.status(500).json({ error: '更新广告活动失败' });
  }
});

// 获取广告统计数据
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, campaignId } = req.query;
    
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (campaignId) {
      matchQuery.campaignId = campaignId;
    }
    
    const analytics = await AdImpression.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$campaignId',
          impressions: { $sum: 1 },
          clicks: { $sum: { $cond: ['$clicked', 1, 0] } },
          conversions: { $sum: { $cond: ['$converted', 1, 0] } },
          revenue: { $sum: '$revenue' }
        }
      },
      {
        $addFields: {
          ctr: { $multiply: [{ $divide: ['$clicks', '$impressions'] }, 100] },
          conversionRate: { $multiply: [{ $divide: ['$conversions', '$clicks'] }, 100] }
        }
      }
    ]);
    
    res.json({
      success: true,
      analytics
    });
    
  } catch (error) {
    console.error('获取广告统计失败:', error);
    res.status(500).json({ error: '获取广告统计失败' });
  }
});

module.exports = router;

