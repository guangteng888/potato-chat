import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  BarChart3, 
  DollarSign, 
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const AITradingStrategies = () => {
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [strategyPerformance, setStrategyPerformance] = useState({});
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  // AI交易策略配置
  const tradingStrategies = [
    {
      id: 'momentum_ai',
      name: '动量追踪AI',
      category: 'trend_following',
      icon: TrendingUp,
      description: '基于机器学习的动量识别和趋势跟踪策略',
      riskLevel: 'medium',
      expectedReturn: '15-25%',
      winRate: 68,
      maxDrawdown: 12,
      pricing: {
        basic: { price: 19.99, features: ['基础信号', '日线级别', '3个交易对'] },
        pro: { price: 49.99, features: ['高级信号', '多时间框架', '10个交易对', '风险管理'] },
        premium: { price: 99.99, features: ['全部功能', '无限交易对', '定制参数', '专属支持'] }
      },
      performance: {
        '1M': { return: 8.5, trades: 45, winRate: 71 },
        '3M': { return: 22.3, trades: 128, winRate: 68 },
        '6M': { return: 41.7, trades: 267, winRate: 65 },
        '1Y': { return: 78.9, trades: 542, winRate: 67 }
      },
      features: [
        '深度学习价格预测',
        '多因子动量模型',
        '自适应止损机制',
        '实时风险监控',
        '智能仓位管理'
      ]
    },
    {
      id: 'arbitrage_ai',
      name: '套利机会AI',
      category: 'arbitrage',
      icon: Zap,
      description: '跨平台套利机会识别和自动执行系统',
      riskLevel: 'low',
      expectedReturn: '8-15%',
      winRate: 85,
      maxDrawdown: 5,
      pricing: {
        basic: { price: 29.99, features: ['基础套利', '2个平台', '手动执行'] },
        pro: { price: 79.99, features: ['高级套利', '5个平台', '半自动执行', '风险控制'] },
        premium: { price: 149.99, features: ['全自动套利', '10+平台', '毫秒级执行', '专属API'] }
      },
      performance: {
        '1M': { return: 3.2, trades: 156, winRate: 87 },
        '3M': { return: 9.8, trades: 445, winRate: 85 },
        '6M': { return: 18.5, trades: 892, winRate: 84 },
        '1Y': { return: 34.2, trades: 1756, winRate: 86 }
      },
      features: [
        '实时价差监控',
        '多平台API集成',
        '毫秒级执行速度',
        '风险敞口控制',
        '手续费优化'
      ]
    },
    {
      id: 'sentiment_ai',
      name: '情绪分析AI',
      category: 'sentiment',
      icon: Brain,
      description: '基于社交媒体和新闻的市场情绪分析策略',
      riskLevel: 'medium',
      expectedReturn: '12-20%',
      winRate: 62,
      maxDrawdown: 15,
      pricing: {
        basic: { price: 24.99, features: ['基础情绪', '主要币种', '日度更新'] },
        pro: { price: 59.99, features: ['高级情绪', '全市场覆盖', '实时更新', '情绪指标'] },
        premium: { price: 119.99, features: ['深度分析', '预测模型', '定制报告', 'API接入'] }
      },
      performance: {
        '1M': { return: 5.7, trades: 32, winRate: 65 },
        '3M': { return: 16.4, trades: 89, winRate: 62 },
        '6M': { return: 28.9, trades: 178, winRate: 61 },
        '1Y': { return: 52.3, trades: 356, winRate: 63 }
      },
      features: [
        'NLP情绪分析',
        '社交媒体监控',
        '新闻事件影响',
        '恐慌贪婪指数',
        '情绪驱动交易'
      ]
    },
    {
      id: 'mean_reversion_ai',
      name: '均值回归AI',
      category: 'mean_reversion',
      icon: RotateCcw,
      description: '基于统计学的均值回归和价格修正策略',
      riskLevel: 'low',
      expectedReturn: '10-18%',
      winRate: 75,
      maxDrawdown: 8,
      pricing: {
        basic: { price: 17.99, features: ['基础回归', '主要交易对', '日线信号'] },
        pro: { price: 42.99, features: ['高级回归', '多时间框架', '风险管理', '回测报告'] },
        premium: { price: 89.99, features: ['量化模型', '参数优化', '组合策略', '实时监控'] }
      },
      performance: {
        '1M': { return: 4.3, trades: 67, winRate: 78 },
        '3M': { return: 13.1, trades: 189, winRate: 75 },
        '6M': { return: 24.7, trades: 378, winRate: 74 },
        '1Y': { return: 46.8, trades: 756, winRate: 76 }
      },
      features: [
        '统计套利模型',
        '协整关系分析',
        '动态阈值调整',
        '多品种组合',
        '风险平价配置'
      ]
    },
    {
      id: 'volatility_ai',
      name: '波动率交易AI',
      category: 'volatility',
      icon: BarChart3,
      description: '基于波动率预测的期权和衍生品交易策略',
      riskLevel: 'high',
      expectedReturn: '20-35%',
      winRate: 58,
      maxDrawdown: 22,
      pricing: {
        basic: { price: 39.99, features: ['基础波动率', '期权策略', '风险提醒'] },
        pro: { price: 89.99, features: ['高级波动率', '组合策略', '希腊字母', '实时调整'] },
        premium: { price: 179.99, features: ['量化模型', '自动对冲', '定制策略', '机构级工具'] }
      },
      performance: {
        '1M': { return: 12.8, trades: 28, winRate: 61 },
        '3M': { return: 31.5, trades: 76, winRate: 58 },
        '6M': { return: 58.2, trades: 145, winRate: 57 },
        '1Y': { return: 102.7, trades: 289, winRate: 59 }
      },
      features: [
        'VIX预测模型',
        '隐含波动率分析',
        '期权组合策略',
        '动态对冲机制',
        '风险敞口管理'
      ]
    },
    {
      id: 'news_ai',
      name: '新闻事件AI',
      category: 'event_driven',
      icon: Target,
      description: '基于重大新闻事件的快速反应交易策略',
      riskLevel: 'high',
      expectedReturn: '18-30%',
      winRate: 55,
      maxDrawdown: 18,
      pricing: {
        basic: { price: 34.99, features: ['基础事件', '主要新闻', '延迟信号'] },
        pro: { price: 74.99, features: ['实时事件', '全球新闻', '快速信号', '影响评估'] },
        premium: { price: 154.99, features: ['毫秒级响应', 'AI新闻解读', '预测模型', '专属通道'] }
      },
      performance: {
        '1M': { return: 9.2, trades: 18, winRate: 56 },
        '3M': { return: 24.7, trades: 52, winRate: 55 },
        '6M': { return: 43.8, trades: 98, winRate: 54 },
        '1Y': { return: 81.3, trades: 187, winRate: 56 }
      },
      features: [
        '实时新闻监控',
        'AI新闻解读',
        '事件影响评估',
        '快速执行机制',
        '风险事件预警'
      ]
    }
  ];

  // 风险等级配置
  const riskLevels = {
    low: { name: '低风险', color: 'text-green-600 bg-green-100', icon: Shield },
    medium: { name: '中等风险', color: 'text-yellow-600 bg-yellow-100', icon: AlertTriangle },
    high: { name: '高风险', color: 'text-red-600 bg-red-100', icon: AlertTriangle }
  };

  // 策略分类
  const categories = {
    trend_following: { name: '趋势跟踪', color: 'bg-blue-100 text-blue-800' },
    arbitrage: { name: '套利策略', color: 'bg-green-100 text-green-800' },
    sentiment: { name: '情绪分析', color: 'bg-purple-100 text-purple-800' },
    mean_reversion: { name: '均值回归', color: 'bg-orange-100 text-orange-800' },
    volatility: { name: '波动率交易', color: 'bg-red-100 text-red-800' },
    event_driven: { name: '事件驱动', color: 'bg-indigo-100 text-indigo-800' }
  };

  const handleSubscribe = async (strategyId, plan) => {
    try {
      const response = await fetch('/api/ai-strategies/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          strategyId,
          plan
        })
      });

      if (response.ok) {
        const result = await response.json();
        // 处理订阅成功
        setUserSubscriptions(prev => [...prev, result.subscription]);
      }
    } catch (error) {
      console.error('订阅失败:', error);
    }
  };

  const renderStrategyCard = (strategy) => {
    const IconComponent = strategy.icon;
    const riskConfig = riskLevels[strategy.riskLevel];
    const RiskIcon = riskConfig.icon;
    const categoryConfig = categories[strategy.category];
    const performance = strategy.performance[selectedTimeframe];

    return (
      <div key={strategy.id} className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-shadow duration-300">
        {/* 策略头部 */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <IconComponent className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{strategy.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryConfig.color}`}>
                  {categoryConfig.name}
                </span>
              </div>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${riskConfig.color}`}>
              <RiskIcon className="w-3 h-3 mr-1" />
              {riskConfig.name}
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{strategy.description}</p>
          
          {/* 关键指标 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{strategy.expectedReturn}</div>
              <div className="text-xs text-gray-500">预期年化收益</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{strategy.winRate}%</div>
              <div className="text-xs text-gray-500">胜率</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{strategy.maxDrawdown}%</div>
              <div className="text-xs text-gray-500">最大回撤</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{performance.trades}</div>
              <div className="text-xs text-gray-500">交易次数</div>
            </div>
          </div>
        </div>

        {/* 性能表现 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">历史表现</h4>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="1M">1个月</option>
              <option value="3M">3个月</option>
              <option value="6M">6个月</option>
              <option value="1Y">1年</option>
            </select>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">+{performance.return}%</div>
              <div className="text-xs text-gray-600">总收益率</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{performance.trades}</div>
              <div className="text-xs text-gray-600">交易次数</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{performance.winRate}%</div>
              <div className="text-xs text-gray-600">胜率</div>
            </div>
          </div>
        </div>

        {/* 核心功能 */}
        <div className="p-6 border-b">
          <h4 className="font-semibold text-gray-900 mb-3">核心功能</h4>
          <div className="space-y-2">
            {strategy.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 订阅计划 */}
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">订阅计划</h4>
          <div className="space-y-3">
            {Object.entries(strategy.pricing).map(([plan, details]) => (
              <div key={plan} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 capitalize">{plan}</span>
                    {plan === 'pro' && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        推荐
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {details.features.join(' • ')}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-gray-900">
                    ${details.price}<span className="text-sm font-normal">/月</span>
                  </div>
                  <button
                    onClick={() => handleSubscribe(strategy.id, plan)}
                    className="mt-1 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    订阅
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI交易策略服务
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          专业的人工智能驱动交易策略，助您在市场中获得优势
        </p>
        
        {/* 服务特色 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI驱动</h3>
            <p className="text-sm text-gray-600">深度学习算法，持续优化策略表现</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">风险控制</h3>
            <p className="text-sm text-gray-600">智能风险管理，保护您的投资资金</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">实时执行</h3>
            <p className="text-sm text-gray-600">毫秒级信号响应，抓住每个机会</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">数据驱动</h3>
            <p className="text-sm text-gray-600">基于海量数据分析，提供精准信号</p>
          </div>
        </div>
      </div>

      {/* 策略列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tradingStrategies.map(renderStrategyCard)}
      </div>

      {/* 服务保障 */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">服务保障</h2>
          <p className="text-gray-600">我们为您的投资提供全方位保障</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">7天免费试用</h3>
            <p className="text-sm text-gray-600">所有策略均提供7天免费试用期，满意后再付费</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">资金安全保障</h3>
            <p className="text-sm text-gray-600">银行级安全防护，资金安全有保障</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7技术支持</h3>
            <p className="text-sm text-gray-600">专业技术团队全天候为您提供支持服务</p>
          </div>
        </div>
      </div>

      {/* 常见问题 */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          常见问题
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                AI策略的成功率如何？
              </h3>
              <p className="text-gray-600 text-sm">
                我们的AI策略经过严格的历史回测和实盘验证，平均胜率在55%-85%之间，具体取决于策略类型和市场环境。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                如何选择适合的策略？
              </h3>
              <p className="text-gray-600 text-sm">
                建议根据您的风险承受能力、投资目标和资金规模选择。保守投资者可选择套利和均值回归策略，激进投资者可选择波动率和事件驱动策略。
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                策略信号如何接收？
              </h3>
              <p className="text-gray-600 text-sm">
                策略信号通过多种方式推送：应用内通知、邮件、短信、API接口等。您可以选择手动执行或设置自动交易。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                可以随时取消订阅吗？
              </h3>
              <p className="text-gray-600 text-sm">
                是的，您可以随时取消订阅。取消后仍可使用至当前计费周期结束，不会产生额外费用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITradingStrategies;

