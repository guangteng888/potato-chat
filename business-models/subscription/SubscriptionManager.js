const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// 订阅计划配置
const SUBSCRIPTION_PLANS = {
  basic: {
    name: '基础版',
    price: { monthly: 0, yearly: 0 },
    features: {
      tradingLimit: 10,
      realTimeData: false,
      advancedCharts: false,
      apiAccess: false,
      prioritySupport: false,
      groupLimit: 5,
      groupSize: 50,
      fileSize: 10 * 1024 * 1024, // 10MB
      videoCall: false
    }
  },
  pro: {
    name: '高级版',
    price: { monthly: 9.99, yearly: 99.99 },
    stripeIds: {
      monthly: 'price_pro_monthly',
      yearly: 'price_pro_yearly'
    },
    features: {
      tradingLimit: -1, // unlimited
      realTimeData: true,
      advancedCharts: true,
      apiAccess: false,
      prioritySupport: true,
      groupLimit: -1,
      groupSize: 200,
      fileSize: 100 * 1024 * 1024, // 100MB
      videoCall: 'oneOnOne'
    }
  },
  premium: {
    name: '专业版',
    price: { monthly: 29.99, yearly: 299.99 },
    stripeIds: {
      monthly: 'price_premium_monthly',
      yearly: 'price_premium_yearly'
    },
    features: {
      tradingLimit: -1,
      realTimeData: true,
      advancedCharts: true,
      apiAccess: true,
      prioritySupport: true,
      groupLimit: -1,
      groupSize: 500,
      fileSize: 1024 * 1024 * 1024, // 1GB
      videoCall: 'group',
      aiStrategies: true,
      customReports: true
    }
  },
  enterprise: {
    name: '企业版',
    price: { monthly: 99.99, yearly: 999.99 },
    stripeIds: {
      monthly: 'price_enterprise_monthly',
      yearly: 'price_enterprise_yearly'
    },
    features: {
      tradingLimit: -1,
      realTimeData: true,
      advancedCharts: true,
      apiAccess: true,
      prioritySupport: true,
      groupLimit: -1,
      groupSize: -1,
      fileSize: -1, // unlimited
      videoCall: 'enterprise',
      aiStrategies: true,
      customReports: true,
      dedicatedSupport: true,
      whiteLabel: true,
      customDevelopment: true
    }
  }
};

// 订阅模型
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['basic', 'pro', 'premium', 'enterprise'],
    default: 'basic'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'unpaid'],
    default: 'active'
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  trialEnd: Date,
  metadata: {
    tradeCount: { type: Number, default: 0 },
    lastTradeReset: { type: Date, default: Date.now },
    features: mongoose.Schema.Types.Mixed
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

subscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// 中间件：验证JWT令牌
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效' });
    }
    req.user = user;
    next();
  });
};

// 获取用户订阅状态
router.get('/status', authenticateToken, async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription) {
      // 创建默认基础版订阅
      subscription = new Subscription({
        userId: req.user.id,
        plan: 'basic',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1年后
      });
      await subscription.save();
    }

    // 检查是否需要重置交易计数
    const now = new Date();
    const lastReset = subscription.metadata.lastTradeReset;
    const daysSinceReset = Math.floor((now - lastReset) / (24 * 60 * 60 * 1000));
    
    if (daysSinceReset >= 30) { // 每月重置
      subscription.metadata.tradeCount = 0;
      subscription.metadata.lastTradeReset = now;
      await subscription.save();
    }

    const planFeatures = SUBSCRIPTION_PLANS[subscription.plan].features;
    const daysRemaining = Math.max(0, Math.ceil((subscription.currentPeriodEnd - now) / (24 * 60 * 60 * 1000)));

    res.json({
      currentPlan: subscription.plan,
      planName: SUBSCRIPTION_PLANS[subscription.plan].name,
      status: subscription.status,
      billingCycle: subscription.billingCycle,
      currentPeriodEnd: subscription.currentPeriodEnd,
      daysRemaining,
      tradeVolume: subscription.metadata.tradeCount || 0,
      features: planFeatures,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
    });
  } catch (error) {
    console.error('获取订阅状态失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 创建订阅
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;

    if (!SUBSCRIPTION_PLANS[plan]) {
      return res.status(400).json({ error: '无效的订阅计划' });
    }

    if (plan === 'basic') {
      // 基础版免费，直接更新订阅
      let subscription = await Subscription.findOne({ userId: req.user.id });
      if (!subscription) {
        subscription = new Subscription({ userId: req.user.id });
      }
      
      subscription.plan = 'basic';
      subscription.status = 'active';
      subscription.billingCycle = billingCycle;
      subscription.currentPeriodStart = new Date();
      subscription.currentPeriodEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      
      await subscription.save();
      
      return res.json({
        success: true,
        subscription: {
          plan: subscription.plan,
          status: subscription.status
        }
      });
    }

    // 付费计划，创建Stripe订阅
    const planConfig = SUBSCRIPTION_PLANS[plan];
    const priceId = planConfig.stripeIds[billingCycle];

    if (!priceId) {
      return res.status(400).json({ error: '无效的计费周期' });
    }

    // 获取或创建Stripe客户
    let subscription = await Subscription.findOne({ userId: req.user.id });
    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          userId: req.user.id.toString()
        }
      });
      customerId = customer.id;
    }

    // 创建Stripe订阅
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: req.user.id.toString(),
        plan: plan
      }
    });

    // 更新本地订阅记录
    if (!subscription) {
      subscription = new Subscription({ userId: req.user.id });
    }

    subscription.plan = plan;
    subscription.billingCycle = billingCycle;
    subscription.stripeCustomerId = customerId;
    subscription.stripeSubscriptionId = stripeSubscription.id;
    subscription.status = stripeSubscription.status;
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);

    await subscription.save();

    res.json({
      success: true,
      subscriptionId: stripeSubscription.id,
      clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret,
      paymentUrl: `${process.env.FRONTEND_URL}/payment/confirm?subscription_id=${stripeSubscription.id}`
    });

  } catch (error) {
    console.error('创建订阅失败:', error);
    res.status(500).json({ error: '创建订阅失败' });
  }
});

// 取消订阅
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ error: '未找到订阅' });
    }

    if (subscription.plan === 'basic') {
      return res.status(400).json({ error: '基础版无需取消' });
    }

    if (subscription.stripeSubscriptionId) {
      // 取消Stripe订阅（在当前周期结束时）
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
    }

    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    res.json({
      success: true,
      message: '订阅将在当前计费周期结束时取消'
    });

  } catch (error) {
    console.error('取消订阅失败:', error);
    res.status(500).json({ error: '取消订阅失败' });
  }
});

// 恢复订阅
router.post('/resume', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({ error: '未找到订阅' });
    }

    // 恢复Stripe订阅
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false
    });

    subscription.cancelAtPeriodEnd = false;
    await subscription.save();

    res.json({
      success: true,
      message: '订阅已恢复'
    });

  } catch (error) {
    console.error('恢复订阅失败:', error);
    res.status(500).json({ error: '恢复订阅失败' });
  }
});

// 更改订阅计划
router.post('/change-plan', authenticateToken, async (req, res) => {
  try {
    const { newPlan, billingCycle } = req.body;
    
    if (!SUBSCRIPTION_PLANS[newPlan]) {
      return res.status(400).json({ error: '无效的订阅计划' });
    }

    const subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ error: '未找到订阅' });
    }

    if (subscription.plan === newPlan) {
      return res.status(400).json({ error: '已经是当前计划' });
    }

    // 如果是降级到基础版
    if (newPlan === 'basic') {
      if (subscription.stripeSubscriptionId) {
        await stripe.subscriptions.del(subscription.stripeSubscriptionId);
      }
      
      subscription.plan = 'basic';
      subscription.stripeSubscriptionId = null;
      subscription.status = 'active';
      subscription.cancelAtPeriodEnd = false;
      
      await subscription.save();
      
      return res.json({
        success: true,
        message: '已降级到基础版'
      });
    }

    // 付费计划之间的切换
    const newPlanConfig = SUBSCRIPTION_PLANS[newPlan];
    const newPriceId = newPlanConfig.stripeIds[billingCycle || subscription.billingCycle];

    if (subscription.stripeSubscriptionId) {
      // 更新现有Stripe订阅
      const stripeSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          items: [{
            id: (await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)).items.data[0].id,
            price: newPriceId
          }],
          proration_behavior: 'create_prorations'
        }
      );

      subscription.plan = newPlan;
      subscription.billingCycle = billingCycle || subscription.billingCycle;
      subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
      subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
      
      await subscription.save();
    }

    res.json({
      success: true,
      message: '订阅计划已更新'
    });

  } catch (error) {
    console.error('更改订阅计划失败:', error);
    res.status(500).json({ error: '更改订阅计划失败' });
  }
});

// 检查功能权限
router.get('/check-feature/:feature', authenticateToken, async (req, res) => {
  try {
    const { feature } = req.params;
    const subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription) {
      return res.json({ allowed: false, reason: '未找到订阅' });
    }

    const planFeatures = SUBSCRIPTION_PLANS[subscription.plan].features;
    
    // 检查特定功能权限
    switch (feature) {
      case 'trading':
        if (planFeatures.tradingLimit === -1) {
          return res.json({ allowed: true });
        }
        if (subscription.metadata.tradeCount >= planFeatures.tradingLimit) {
          return res.json({ 
            allowed: false, 
            reason: '已达到本月交易次数限制',
            limit: planFeatures.tradingLimit,
            used: subscription.metadata.tradeCount
          });
        }
        return res.json({ allowed: true });
        
      case 'realTimeData':
        return res.json({ allowed: planFeatures.realTimeData });
        
      case 'apiAccess':
        return res.json({ allowed: planFeatures.apiAccess });
        
      case 'videoCall':
        return res.json({ 
          allowed: !!planFeatures.videoCall,
          type: planFeatures.videoCall
        });
        
      default:
        return res.json({ 
          allowed: planFeatures[feature] !== undefined ? planFeatures[feature] : false 
        });
    }
    
  } catch (error) {
    console.error('检查功能权限失败:', error);
    res.status(500).json({ error: '检查功能权限失败' });
  }
});

// 记录交易使用
router.post('/record-usage', authenticateToken, async (req, res) => {
  try {
    const { type, amount = 1 } = req.body;
    const subscription = await Subscription.findOne({ userId: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ error: '未找到订阅' });
    }

    switch (type) {
      case 'trade':
        subscription.metadata.tradeCount = (subscription.metadata.tradeCount || 0) + amount;
        break;
      // 可以添加其他使用类型的记录
    }

    await subscription.save();
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('记录使用失败:', error);
    res.status(500).json({ error: '记录使用失败' });
  }
});

// Stripe Webhook处理
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook签名验证失败:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      default:
        console.log(`未处理的事件类型: ${event.type}`);
    }

    res.json({received: true});
    
  } catch (error) {
    console.error('处理Webhook失败:', error);
    res.status(500).json({ error: '处理Webhook失败' });
  }
});

// Webhook处理函数
async function handlePaymentSucceeded(invoice) {
  const subscription = await Subscription.findOne({ 
    stripeSubscriptionId: invoice.subscription 
  });
  
  if (subscription) {
    subscription.status = 'active';
    await subscription.save();
  }
}

async function handlePaymentFailed(invoice) {
  const subscription = await Subscription.findOne({ 
    stripeSubscriptionId: invoice.subscription 
  });
  
  if (subscription) {
    subscription.status = 'past_due';
    await subscription.save();
  }
}

async function handleSubscriptionUpdated(stripeSubscription) {
  const subscription = await Subscription.findOne({ 
    stripeSubscriptionId: stripeSubscription.id 
  });
  
  if (subscription) {
    subscription.status = stripeSubscription.status;
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;
    await subscription.save();
  }
}

async function handleSubscriptionDeleted(stripeSubscription) {
  const subscription = await Subscription.findOne({ 
    stripeSubscriptionId: stripeSubscription.id 
  });
  
  if (subscription) {
    subscription.plan = 'basic';
    subscription.status = 'active';
    subscription.stripeSubscriptionId = null;
    subscription.cancelAtPeriodEnd = false;
    await subscription.save();
  }
}

module.exports = router;

