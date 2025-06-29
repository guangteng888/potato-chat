import React, { useState, useEffect } from 'react';
import { Check, Crown, Star, Zap, Shield, Users, TrendingUp, Headphones } from 'lucide-react';

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [userStats, setUserStats] = useState({
    currentPlan: 'basic',
    tradeVolume: 0,
    daysRemaining: 0
  });

  const plans = {
    basic: {
      name: '基础版',
      icon: Users,
      price: { monthly: 0, yearly: 0 },
      description: '适合新手用户的基础功能',
      features: [
        '基础聊天功能',
        '简单市场数据',
        '有限交易次数 (10次/月)',
        '标准客服支持',
        '基础图表工具',
        '社区访问权限'
      ],
      limitations: [
        '交易次数限制',
        '延迟市场数据',
        '基础技术指标',
        '标准客服响应'
      ],
      color: 'bg-gray-50 border-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    pro: {
      name: '高级版',
      icon: Star,
      price: { monthly: 9.99, yearly: 99.99 },
      description: '专业投资者的理想选择',
      features: [
        '无限聊天和群组',
        '实时市场数据',
        '无限交易次数',
        '高级图表工具',
        '优先客服支持',
        '技术分析指标',
        '价格预警功能',
        '投资组合分析'
      ],
      limitations: [],
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    },
    premium: {
      name: '专业版',
      icon: Crown,
      price: { monthly: 29.99, yearly: 299.99 },
      description: '专业交易者的全功能套餐',
      features: [
        '所有高级版功能',
        'AI交易策略',
        '深度市场分析',
        '专属客户经理',
        'API接入权限',
        '高级风险管理',
        '量化交易工具',
        '实时数据流',
        '定制化报告'
      ],
      limitations: [],
      color: 'bg-purple-50 border-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    },
    enterprise: {
      name: '企业版',
      icon: Shield,
      price: { monthly: 99.99, yearly: 999.99 },
      description: '企业级解决方案',
      features: [
        '所有专业版功能',
        '批量账户管理',
        '定制化服务',
        '专属服务器',
        '24/7技术支持',
        '白标解决方案',
        '合规报告',
        '多级权限管理',
        '专属API配额',
        '定制化开发'
      ],
      limitations: [],
      color: 'bg-gold-50 border-gold-200',
      buttonColor: 'bg-gold-600 hover:bg-gold-700',
      popular: false
    }
  };

  const features = [
    {
      category: '交易功能',
      icon: TrendingUp,
      items: [
        { name: '交易次数', basic: '10次/月', pro: '无限制', premium: '无限制', enterprise: '无限制' },
        { name: '市场数据', basic: '延迟15分钟', pro: '实时数据', premium: '实时数据', enterprise: '实时数据' },
        { name: '技术指标', basic: '基础5个', pro: '高级20个', premium: '专业50+', enterprise: '全部+定制' },
        { name: 'API访问', basic: '❌', pro: '❌', premium: '✅', enterprise: '✅ 专属配额' }
      ]
    },
    {
      category: '社交功能',
      icon: Users,
      items: [
        { name: '群组数量', basic: '5个', pro: '无限制', premium: '无限制', enterprise: '无限制' },
        { name: '群组人数', basic: '50人', pro: '200人', premium: '500人', enterprise: '无限制' },
        { name: '文件分享', basic: '10MB', pro: '100MB', premium: '1GB', enterprise: '无限制' },
        { name: '视频通话', basic: '❌', pro: '1对1', premium: '群组通话', enterprise: '企业会议' }
      ]
    },
    {
      category: '客服支持',
      icon: Headphones,
      items: [
        { name: '响应时间', basic: '24小时', pro: '12小时', premium: '4小时', enterprise: '1小时' },
        { name: '支持方式', basic: '邮件', pro: '邮件+聊天', premium: '全渠道', enterprise: '专属经理' },
        { name: '技术支持', basic: '工作时间', pro: '工作时间', premium: '16小时', enterprise: '24/7' },
        { name: '培训服务', basic: '❌', pro: '在线文档', premium: '视频教程', enterprise: '定制培训' }
      ]
    }
  ];

  const handlePlanSelect = (planKey) => {
    setSelectedPlan(planKey);
  };

  const handleSubscribe = async (planKey) => {
    try {
      // 模拟订阅API调用
      const response = await fetch('/api/subscription/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          plan: planKey,
          billingCycle: billingCycle
        })
      });

      if (response.ok) {
        const result = await response.json();
        // 处理支付流程
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        }
      }
    } catch (error) {
      console.error('订阅失败:', error);
    }
  };

  const calculateSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.price.monthly > 0) {
      const monthlyCost = plan.price.monthly * 12;
      const yearlyCost = plan.price.yearly;
      const savings = monthlyCost - yearlyCost;
      const percentage = Math.round((savings / monthlyCost) * 100);
      return { amount: savings, percentage };
    }
    return null;
  };

  useEffect(() => {
    // 获取用户当前订阅状态
    const fetchUserSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/status', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
        }
      } catch (error) {
        console.error('获取订阅状态失败:', error);
      }
    };

    fetchUserSubscription();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          选择适合您的订阅计划
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          解锁更多功能，提升您的交易体验
        </p>
        
        {/* 计费周期切换 */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              按月付费
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              按年付费
              <span className="ml-2 text-sm text-green-600 font-semibold">
                节省17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 订阅计划卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {Object.entries(plans).map(([key, plan]) => {
          const IconComponent = plan.icon;
          const savings = calculateSavings(plan);
          const currentPrice = plan.price[billingCycle];
          
          return (
            <div
              key={key}
              className={`relative rounded-2xl border-2 p-8 ${plan.color} ${
                selectedPlan === key ? 'ring-2 ring-blue-500' : ''
              } transition-all duration-200 hover:shadow-lg cursor-pointer`}
              onClick={() => handlePlanSelect(key)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    最受欢迎
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <IconComponent className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900">
                    ${currentPrice}
                    <span className="text-lg font-normal text-gray-600">
                      /{billingCycle === 'monthly' ? '月' : '年'}
                    </span>
                  </div>
                  {savings && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      节省 ${savings.amount} ({savings.percentage}%)
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(key);
                  }}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${plan.buttonColor}`}
                  disabled={userStats.currentPlan === key}
                >
                  {userStats.currentPlan === key ? '当前计划' : 
                   key === 'basic' ? '免费使用' : '立即订阅'}
                </button>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">功能特性：</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* 功能对比表 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold text-gray-900">详细功能对比</h2>
          <p className="text-gray-600 mt-2">了解各个计划的具体功能差异</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">功能</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">基础版</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">高级版</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">专业版</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">企业版</th>
              </tr>
            </thead>
            <tbody>
              {features.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="py-3 px-6">
                      <div className="flex items-center">
                        <category.icon className="w-5 h-5 mr-2 text-gray-600" />
                        <span className="font-semibold text-gray-900">{category.category}</span>
                      </div>
                    </td>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr key={itemIndex} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-900">{item.name}</td>
                      <td className="py-4 px-6 text-center text-gray-700">{item.basic}</td>
                      <td className="py-4 px-6 text-center text-gray-700">{item.pro}</td>
                      <td className="py-4 px-6 text-center text-gray-700">{item.premium}</td>
                      <td className="py-4 px-6 text-center text-gray-700">{item.enterprise}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 用户当前状态 */}
      {userStats.currentPlan !== 'basic' && (
        <div className="mt-12 bg-blue-50 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                当前订阅状态
              </h3>
              <p className="text-gray-600">
                您正在使用 {plans[userStats.currentPlan]?.name} 计划
              </p>
              {userStats.daysRemaining > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  剩余 {userStats.daysRemaining} 天
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ${userStats.tradeVolume.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">本月交易量</div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ部分 */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          常见问题
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                可以随时取消订阅吗？
              </h3>
              <p className="text-gray-600">
                是的，您可以随时取消订阅。取消后，您仍可以使用付费功能直到当前计费周期结束。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                支持哪些支付方式？
              </h3>
              <p className="text-gray-600">
                我们支持信用卡、PayPal、银行转账等多种支付方式，确保您的支付安全便捷。
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                可以升级或降级计划吗？
              </h3>
              <p className="text-gray-600">
                可以的，您可以随时升级或降级您的订阅计划。费用将按比例调整。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                企业版有什么特殊服务？
              </h3>
              <p className="text-gray-600">
                企业版提供专属客户经理、定制化开发、专属服务器等企业级服务。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

