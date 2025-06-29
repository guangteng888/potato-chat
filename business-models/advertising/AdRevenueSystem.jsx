import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  DollarSign, 
  BarChart3, 
  Settings,
  Play,
  Image,
  FileText,
  MapPin,
  Calendar,
  Filter
} from 'lucide-react';

const AdRevenueSystem = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adStats, setAdStats] = useState({
    totalRevenue: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cpm: 0,
    activeAds: 0
  });
  const [adCampaigns, setAdCampaigns] = useState([]);
  const [targetingOptions, setTargetingOptions] = useState({
    demographics: [],
    interests: [],
    locations: [],
    tradingBehavior: []
  });

  // 广告类型配置
  const adTypes = [
    {
      id: 'banner',
      name: '横幅广告',
      icon: Image,
      description: '页面顶部或底部的横幅广告',
      sizes: ['320x50', '728x90', '970x250'],
      pricing: { cpm: 2.5, cpc: 0.15 },
      positions: ['header', 'footer', 'sidebar']
    },
    {
      id: 'native',
      name: '信息流广告',
      icon: FileText,
      description: '融入内容流的原生广告',
      sizes: ['300x250', '320x480'],
      pricing: { cpm: 4.2, cpc: 0.25 },
      positions: ['feed', 'chat', 'news']
    },
    {
      id: 'video',
      name: '视频广告',
      icon: Play,
      description: '短视频或插播视频广告',
      sizes: ['16:9', '9:16', '1:1'],
      pricing: { cpm: 12.0, cpc: 0.45 },
      positions: ['pre-roll', 'mid-roll', 'post-roll']
    },
    {
      id: 'sponsored',
      name: '赞助内容',
      icon: TrendingUp,
      description: '品牌赞助的专业内容',
      sizes: ['custom'],
      pricing: { cpm: 8.5, cpc: 0.35 },
      positions: ['article', 'analysis', 'tutorial']
    }
  ];

  // 定向投放选项
  const targetingCategories = {
    demographics: {
      name: '人口统计',
      icon: Users,
      options: [
        { id: 'age_18_25', name: '18-25岁', count: 15420 },
        { id: 'age_26_35', name: '26-35岁', count: 28350 },
        { id: 'age_36_45', name: '36-45岁', count: 22180 },
        { id: 'age_46_plus', name: '46岁以上', count: 12890 },
        { id: 'male', name: '男性', count: 45620 },
        { id: 'female', name: '女性', count: 33220 }
      ]
    },
    interests: {
      name: '兴趣标签',
      icon: Target,
      options: [
        { id: 'crypto', name: '加密货币', count: 35420 },
        { id: 'stocks', name: '股票投资', count: 28350 },
        { id: 'forex', name: '外汇交易', count: 18750 },
        { id: 'commodities', name: '大宗商品', count: 12890 },
        { id: 'tech_analysis', name: '技术分析', count: 22180 },
        { id: 'fundamental', name: '基本面分析', count: 15670 }
      ]
    },
    locations: {
      name: '地理位置',
      icon: MapPin,
      options: [
        { id: 'us', name: '美国', count: 25420 },
        { id: 'eu', name: '欧盟', count: 18350 },
        { id: 'asia', name: '亚洲', count: 32180 },
        { id: 'china', name: '中国', count: 15890 },
        { id: 'japan', name: '日本', count: 8750 },
        { id: 'korea', name: '韩国', count: 6420 }
      ]
    },
    tradingBehavior: {
      name: '交易行为',
      icon: BarChart3,
      options: [
        { id: 'high_volume', name: '高频交易者', count: 8420 },
        { id: 'day_trader', name: '日内交易者', count: 12350 },
        { id: 'swing_trader', name: '波段交易者', count: 18750 },
        { id: 'long_term', name: '长期投资者', count: 25890 },
        { id: 'new_trader', name: '新手交易者', count: 15670 },
        { id: 'premium_user', name: '付费用户', count: 9420 }
      ]
    }
  };

  // 模拟广告活动数据
  const mockCampaigns = [
    {
      id: 1,
      name: 'CryptoExchange Pro 推广',
      advertiser: 'CryptoExchange',
      type: 'banner',
      status: 'active',
      budget: 5000,
      spent: 3250,
      impressions: 125000,
      clicks: 1875,
      ctr: 1.5,
      cpm: 2.6,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      targeting: ['crypto', 'high_volume', 'age_26_35']
    },
    {
      id: 2,
      name: 'TradingBot AI 服务',
      advertiser: 'TradingBot Inc',
      type: 'native',
      status: 'active',
      budget: 8000,
      spent: 4200,
      impressions: 95000,
      clicks: 2375,
      ctr: 2.5,
      cpm: 4.4,
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      targeting: ['tech_analysis', 'premium_user', 'day_trader']
    },
    {
      id: 3,
      name: 'Investment Course 在线课程',
      advertiser: 'EduFinance',
      type: 'video',
      status: 'paused',
      budget: 12000,
      spent: 8500,
      impressions: 68000,
      clicks: 2720,
      ctr: 4.0,
      cpm: 12.5,
      startDate: '2023-12-15',
      endDate: '2024-01-15',
      targeting: ['new_trader', 'fundamental', 'age_18_25']
    }
  ];

  // 广告位管理
  const adPlacements = [
    {
      id: 'header_banner',
      name: '顶部横幅',
      type: 'banner',
      size: '970x250',
      position: 'header',
      fillRate: 85,
      avgCPM: 2.8,
      dailyImpressions: 45000,
      status: 'active'
    },
    {
      id: 'sidebar_native',
      name: '侧边栏信息流',
      type: 'native',
      size: '300x250',
      position: 'sidebar',
      fillRate: 92,
      avgCPM: 4.5,
      dailyImpressions: 28000,
      status: 'active'
    },
    {
      id: 'chat_native',
      name: '聊天页信息流',
      type: 'native',
      size: '320x480',
      position: 'chat',
      fillRate: 78,
      avgCPM: 3.8,
      dailyImpressions: 35000,
      status: 'active'
    },
    {
      id: 'video_preroll',
      name: '视频前贴片',
      type: 'video',
      size: '16:9',
      position: 'pre-roll',
      fillRate: 65,
      avgCPM: 15.2,
      dailyImpressions: 12000,
      status: 'testing'
    }
  ];

  useEffect(() => {
    // 模拟获取广告统计数据
    setAdStats({
      totalRevenue: 28750.50,
      impressions: 1250000,
      clicks: 18750,
      ctr: 1.5,
      cpm: 4.2,
      activeAds: 15
    });
    setAdCampaigns(mockCampaigns);
  }, []);

  const renderOverview = () => (
    <div className="space-y-8">
      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总收入</p>
              <p className="text-2xl font-bold text-gray-900">
                ${adStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+12.5% 较上月</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">展示次数</p>
              <p className="text-2xl font-bold text-gray-900">
                {(adStats.impressions / 1000000).toFixed(1)}M
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-blue-600 mt-2">+8.3% 较上月</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">点击次数</p>
              <p className="text-2xl font-bold text-gray-900">
                {adStats.clicks.toLocaleString()}
              </p>
            </div>
            <MousePointer className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-purple-600 mt-2">+15.7% 较上月</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">点击率</p>
              <p className="text-2xl font-bold text-gray-900">
                {adStats.ctr.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-sm text-orange-600 mt-2">+2.1% 较上月</p>
        </div>
      </div>

      {/* 广告位表现 */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">广告位表现</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-6 font-medium text-gray-900">广告位</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">类型</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">填充率</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">平均CPM</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">日展示量</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">状态</th>
              </tr>
            </thead>
            <tbody>
              {adPlacements.map((placement) => (
                <tr key={placement.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{placement.name}</div>
                      <div className="text-sm text-gray-500">{placement.size}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {placement.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${placement.fillRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{placement.fillRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-medium">
                    ${placement.avgCPM.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {placement.dailyImpressions.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      placement.status === 'active' ? 'bg-green-100 text-green-800' :
                      placement.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {placement.status === 'active' ? '活跃' :
                       placement.status === 'testing' ? '测试中' : '暂停'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      {/* 活动列表 */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">广告活动</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              创建活动
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-6 font-medium text-gray-900">活动名称</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">广告主</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">类型</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">预算/花费</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">展示/点击</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">CTR</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">状态</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">操作</th>
              </tr>
            </thead>
            <tbody>
              {adCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        {campaign.startDate} - {campaign.endDate}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    {campaign.advertiser}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {campaign.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-sm">
                      <div className="font-medium">${campaign.budget.toLocaleString()}</div>
                      <div className="text-gray-500">${campaign.spent.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-sm">
                      <div className="font-medium">{campaign.impressions.toLocaleString()}</div>
                      <div className="text-gray-500">{campaign.clicks.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-medium">
                    {campaign.ctr.toFixed(1)}%
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status === 'active' ? '活跃' :
                       campaign.status === 'paused' ? '暂停' : '已结束'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      编辑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTargeting = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">精准投放设置</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(targetingCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <div key={key} className="space-y-4">
                <div className="flex items-center">
                  <IconComponent className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                </div>
                
                <div className="space-y-2">
                  {category.options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={option.id}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={option.id} className="ml-3 text-sm text-gray-700">
                          {option.name}
                        </label>
                      </div>
                      <span className="text-sm text-gray-500">
                        {option.count.toLocaleString()} 用户
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 投放预览 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">投放效果预估</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">125K</div>
            <div className="text-sm text-gray-600">预估覆盖用户</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">$3.20</div>
            <div className="text-sm text-gray-600">预估CPM</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">2.1%</div>
            <div className="text-sm text-gray-600">预估CTR</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdTypes = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {adTypes.map((adType) => {
        const IconComponent = adType.icon;
        return (
          <div key={adType.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <IconComponent className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">{adType.name}</h3>
            </div>
            
            <p className="text-gray-600 mb-4">{adType.description}</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">支持尺寸</h4>
                <div className="flex flex-wrap gap-2">
                  {adType.sizes.map((size) => (
                    <span key={size} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">定价</h4>
                <div className="flex space-x-4 text-sm">
                  <span className="text-gray-600">
                    CPM: <span className="font-medium">${adType.pricing.cpm}</span>
                  </span>
                  <span className="text-gray-600">
                    CPC: <span className="font-medium">${adType.pricing.cpc}</span>
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">投放位置</h4>
                <div className="flex flex-wrap gap-2">
                  {adType.positions.map((position) => (
                    <span key={position} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {position}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const tabs = [
    { id: 'overview', name: '概览', icon: BarChart3 },
    { id: 'campaigns', name: '广告活动', icon: Target },
    { id: 'targeting', name: '精准投放', icon: Users },
    { id: 'ad-types', name: '广告类型', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          广告收入系统
        </h1>
        <p className="text-gray-600">
          管理广告投放，优化收入表现
        </p>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 标签页内容 */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'targeting' && renderTargeting()}
        {activeTab === 'ad-types' && renderAdTypes()}
      </div>
    </div>
  );
};

export default AdRevenueSystem;

