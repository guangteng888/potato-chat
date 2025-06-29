import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, BarChart3, Users, Crown, Zap, Calculator, Info } from 'lucide-react';

const TradingFeeStructure = () => {
  const [userTier, setUserTier] = useState('standard');
  const [tradeAmount, setTradeAmount] = useState(1000);
  const [tradeType, setTradeType] = useState('spot');
  const [monthlyVolume, setMonthlyVolume] = useState(0);
  const [calculatedFee, setCalculatedFee] = useState(0);

  // 交易手续费结构
  const feeStructure = {
    spot: {
      name: '现货交易',
      icon: TrendingUp,
      tiers: {
        standard: { rate: 0.002, name: '标准用户', minVolume: 0 },
        bronze: { rate: 0.0018, name: '铜牌用户', minVolume: 10000 },
        silver: { rate: 0.0015, name: '银牌用户', minVolume: 50000 },
        gold: { rate: 0.0012, name: '金牌用户', minVolume: 100000 },
        platinum: { rate: 0.001, name: '白金用户', minVolume: 500000 },
        diamond: { rate: 0.0008, name: '钻石用户', minVolume: 1000000 }
      }
    },
    futures: {
      name: '期货交易',
      icon: BarChart3,
      tiers: {
        standard: { rate: 0.0015, name: '标准用户', minVolume: 0 },
        bronze: { rate: 0.0013, name: '铜牌用户', minVolume: 10000 },
        silver: { rate: 0.0011, name: '银牌用户', minVolume: 50000 },
        gold: { rate: 0.0009, name: '金牌用户', minVolume: 100000 },
        platinum: { rate: 0.0007, name: '白金用户', minVolume: 500000 },
        diamond: { rate: 0.0005, name: '钻石用户', minVolume: 1000000 }
      }
    },
    options: {
      name: '期权交易',
      icon: Zap,
      tiers: {
        standard: { rate: 5, name: '标准用户', minVolume: 0, unit: '每合约' },
        bronze: { rate: 4.5, name: '铜牌用户', minVolume: 10000, unit: '每合约' },
        silver: { rate: 4, name: '银牌用户', minVolume: 50000, unit: '每合约' },
        gold: { rate: 3.5, name: '金牌用户', minVolume: 100000, unit: '每合约' },
        platinum: { rate: 3, name: '白金用户', minVolume: 500000, unit: '每合约' },
        diamond: { rate: 2.5, name: '钻石用户', minVolume: 1000000, unit: '每合约' }
      }
    },
    forex: {
      name: '外汇交易',
      icon: DollarSign,
      tiers: {
        standard: { rate: 3, name: '标准用户', minVolume: 0, unit: '点差' },
        bronze: { rate: 2.8, name: '铜牌用户', minVolume: 10000, unit: '点差' },
        silver: { rate: 2.5, name: '银牌用户', minVolume: 50000, unit: '点差' },
        gold: { rate: 2.2, name: '金牌用户', minVolume: 100000, unit: '点差' },
        platinum: { rate: 2, name: '白金用户', minVolume: 500000, unit: '点差' },
        diamond: { rate: 1.8, name: '钻石用户', minVolume: 1000000, unit: '点差' }
      }
    }
  };

  // VIP等级配置
  const vipTiers = [
    {
      tier: 'standard',
      name: '标准用户',
      icon: Users,
      minVolume: 0,
      benefits: ['基础交易功能', '标准手续费率', '邮件客服支持'],
      color: 'bg-gray-50 border-gray-200'
    },
    {
      tier: 'bronze',
      name: '铜牌用户',
      icon: Users,
      minVolume: 10000,
      benefits: ['10%手续费折扣', '优先客服支持', '基础市场分析'],
      color: 'bg-orange-50 border-orange-200'
    },
    {
      tier: 'silver',
      name: '银牌用户',
      icon: Users,
      minVolume: 50000,
      benefits: ['25%手续费折扣', '实时客服支持', '高级图表工具'],
      color: 'bg-gray-50 border-gray-300'
    },
    {
      tier: 'gold',
      name: '金牌用户',
      icon: Crown,
      minVolume: 100000,
      benefits: ['40%手续费折扣', '专属客户经理', 'API接入权限'],
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      tier: 'platinum',
      name: '白金用户',
      icon: Crown,
      minVolume: 500000,
      benefits: ['50%手续费折扣', '24/7专属支持', '高级交易工具'],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      tier: 'diamond',
      name: '钻石用户',
      icon: Crown,
      minVolume: 1000000,
      benefits: ['60%手续费折扣', '定制化服务', '专属交易通道'],
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  // 计算手续费
  const calculateFee = () => {
    const currentStructure = feeStructure[tradeType];
    const tierInfo = currentStructure.tiers[userTier];
    
    let fee = 0;
    if (tradeType === 'options') {
      // 期权按合约数计算
      const contracts = Math.ceil(tradeAmount / 100); // 假设每100美元一个合约
      fee = contracts * tierInfo.rate;
    } else if (tradeType === 'forex') {
      // 外汇按点差计算
      fee = tierInfo.rate; // 直接返回点差
    } else {
      // 现货和期货按百分比计算
      fee = tradeAmount * tierInfo.rate;
    }
    
    setCalculatedFee(fee);
  };

  // 根据月交易量确定用户等级
  const determineUserTier = (volume) => {
    const tiers = Object.keys(feeStructure.spot.tiers).reverse();
    for (const tier of tiers) {
      if (volume >= feeStructure.spot.tiers[tier].minVolume) {
        return tier;
      }
    }
    return 'standard';
  };

  useEffect(() => {
    calculateFee();
  }, [tradeAmount, tradeType, userTier]);

  useEffect(() => {
    const newTier = determineUserTier(monthlyVolume);
    setUserTier(newTier);
  }, [monthlyVolume]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          交易手续费结构
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          透明的费率结构，交易量越大，费率越优惠
        </p>
      </div>

      {/* 手续费计算器 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="flex items-center mb-6">
          <Calculator className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">手续费计算器</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              交易类型
            </label>
            <select
              value={tradeType}
              onChange={(e) => setTradeType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(feeStructure).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              交易金额 (USD)
            </label>
            <input
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入交易金额"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              月交易量 (USD)
            </label>
            <input
              type="number"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入月交易量"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              当前等级
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              {feeStructure[tradeType].tiers[userTier].name}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                预计手续费
              </h3>
              <p className="text-gray-600">
                基于当前等级和交易类型计算
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {tradeType === 'forex' ? 
                  `${calculatedFee} 点差` : 
                  `$${calculatedFee.toFixed(2)}`
                }
              </div>
              <div className="text-sm text-gray-600">
                费率: {feeStructure[tradeType].tiers[userTier].rate}
                {feeStructure[tradeType].tiers[userTier].unit ? 
                  ` ${feeStructure[tradeType].tiers[userTier].unit}` : '%'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIP等级体系 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          VIP等级体系
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipTiers.map((tier) => {
            const IconComponent = tier.icon;
            const isCurrentTier = tier.tier === userTier;
            
            return (
              <div
                key={tier.tier}
                className={`rounded-2xl border-2 p-6 transition-all duration-200 ${tier.color} ${
                  isCurrentTier ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                {isCurrentTier && (
                  <div className="text-center mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      当前等级
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <IconComponent className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600">
                    月交易量 ≥ ${tier.minVolume.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">专享权益：</h4>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 详细费率表 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
        <div className="px-8 py-6 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold text-gray-900">详细费率表</h2>
          <p className="text-gray-600 mt-2">各交易类型的完整费率结构</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">用户等级</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">月交易量要求</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">现货交易</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">期货交易</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">期权交易</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-900">外汇交易</th>
              </tr>
            </thead>
            <tbody>
              {vipTiers.map((tier, index) => (
                <tr key={tier.tier} className={`border-b hover:bg-gray-50 ${
                  tier.tier === userTier ? 'bg-blue-50' : ''
                }`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <tier.icon className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="font-medium text-gray-900">{tier.name}</span>
                      {tier.tier === userTier && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          当前
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    ${tier.minVolume.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    {(feeStructure.spot.tiers[tier.tier].rate * 100).toFixed(2)}%
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    {(feeStructure.futures.tiers[tier.tier].rate * 100).toFixed(2)}%
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    ${feeStructure.options.tiers[tier.tier].rate}/合约
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    {feeStructure.forex.tiers[tier.tier].rate} 点差
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 特殊优惠和说明 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🎉 新用户专享优惠
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <span>注册即享30天免手续费交易</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <span>首次充值$1000以上，额外获得$50交易金</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <span>推荐好友注册，双方各获得20%手续费返佣</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            💎 机构用户特权
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <span>定制化费率方案，最低可至0.05%</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <span>专属API接口，毫秒级交易执行</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <span>24/7专属客户经理服务</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 费用说明 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              重要说明
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="space-y-2">
                <li>• 手续费按交易金额的百分比收取（期权除外）</li>
                <li>• VIP等级根据过去30天的交易量计算</li>
                <li>• 等级升级立即生效，降级有7天缓冲期</li>
                <li>• 所有费率均为双向收取（买入和卖出）</li>
              </ul>
              <ul className="space-y-2">
                <li>• 期权交易按合约数量收取固定费用</li>
                <li>• 外汇交易采用点差模式，无额外手续费</li>
                <li>• 机构用户可申请定制化费率方案</li>
                <li>• 费率结构可能根据市场情况调整</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingFeeStructure;

