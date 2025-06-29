import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Crown, 
  Palette, 
  MessageCircle, 
  Users, 
  Zap, 
  Gift,
  Heart,
  Sparkles,
  Award,
  Shield,
  Flame,
  Music,
  Camera,
  Gamepad2
} from 'lucide-react';

const VirtualGoodsStore = () => {
  const [selectedCategory, setSelectedCategory] = useState('themes');
  const [cart, setCart] = useState([]);
  const [userCoins, setUserCoins] = useState(1250);
  const [ownedItems, setOwnedItems] = useState([]);

  // 虚拟商品分类
  const categories = [
    { id: 'themes', name: '主题皮肤', icon: Palette, color: 'bg-purple-100 text-purple-600' },
    { id: 'avatars', name: '头像框', icon: Crown, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'emojis', name: '表情包', icon: MessageCircle, color: 'bg-blue-100 text-blue-600' },
    { id: 'badges', name: '徽章标识', icon: Award, color: 'bg-green-100 text-green-600' },
    { id: 'effects', name: '特效动画', icon: Sparkles, color: 'bg-pink-100 text-pink-600' },
    { id: 'sounds', name: '提示音效', icon: Music, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'features', name: '功能增强', icon: Zap, color: 'bg-orange-100 text-orange-600' }
  ];

  // 虚拟商品数据
  const virtualGoods = {
    themes: [
      {
        id: 'theme_dark_pro',
        name: '专业暗黑主题',
        description: '专为交易者设计的暗黑主题，减少眼部疲劳',
        price: 299,
        currency: 'coins',
        rarity: 'epic',
        preview: '/themes/dark-pro.jpg',
        features: ['护眼暗色', '专业配色', '图表优化', '夜间模式'],
        category: 'themes',
        popular: true
      },
      {
        id: 'theme_neon_trader',
        name: '霓虹交易者',
        description: '炫酷的霓虹风格主题，彰显个性',
        price: 399,
        currency: 'coins',
        rarity: 'legendary',
        preview: '/themes/neon-trader.jpg',
        features: ['霓虹特效', '动态背景', '发光边框', '科技感UI'],
        category: 'themes',
        limited: true
      },
      {
        id: 'theme_minimal_white',
        name: '极简白色',
        description: '简洁优雅的白色主题，清新自然',
        price: 199,
        currency: 'coins',
        rarity: 'rare',
        preview: '/themes/minimal-white.jpg',
        features: ['极简设计', '清新配色', '护眼白色', '简约图标'],
        category: 'themes'
      },
      {
        id: 'theme_crypto_gold',
        name: '加密黄金',
        description: '奢华的金色主题，展现财富气息',
        price: 599,
        currency: 'coins',
        rarity: 'legendary',
        preview: '/themes/crypto-gold.jpg',
        features: ['黄金配色', '奢华质感', '金属光泽', 'VIP专属'],
        category: 'themes',
        vip: true
      }
    ],
    avatars: [
      {
        id: 'avatar_diamond_crown',
        name: '钻石皇冠',
        description: '闪耀的钻石皇冠头像框',
        price: 499,
        currency: 'coins',
        rarity: 'legendary',
        preview: '/avatars/diamond-crown.png',
        features: ['钻石特效', '闪光动画', '皇冠造型', '尊贵象征'],
        category: 'avatars',
        animated: true
      },
      {
        id: 'avatar_fire_ring',
        name: '烈焰光环',
        description: '燃烧的火焰环绕头像框',
        price: 399,
        currency: 'coins',
        rarity: 'epic',
        preview: '/avatars/fire-ring.png',
        features: ['火焰特效', '动态燃烧', '热力光环', '炫酷动画'],
        category: 'avatars',
        animated: true
      },
      {
        id: 'avatar_crypto_border',
        name: '加密边框',
        description: '科技感十足的加密货币边框',
        price: 299,
        currency: 'coins',
        rarity: 'rare',
        preview: '/avatars/crypto-border.png',
        features: ['科技边框', '数字元素', '加密符号', '未来感'],
        category: 'avatars'
      }
    ],
    emojis: [
      {
        id: 'emoji_trader_pack',
        name: '交易者表情包',
        description: '专为交易者设计的表情包合集',
        price: 199,
        currency: 'coins',
        rarity: 'rare',
        preview: '/emojis/trader-pack.png',
        features: ['50个表情', '交易主题', '情绪表达', '专业设计'],
        category: 'emojis',
        count: 50
      },
      {
        id: 'emoji_crypto_memes',
        name: '加密货币梗图',
        description: '热门的加密货币梗图表情包',
        price: 299,
        currency: 'coins',
        rarity: 'epic',
        preview: '/emojis/crypto-memes.png',
        features: ['热门梗图', '社区流行', '幽默风趣', '定期更新'],
        category: 'emojis',
        count: 30,
        trending: true
      },
      {
        id: 'emoji_animated_set',
        name: '动态表情合集',
        description: '生动有趣的动态表情包',
        price: 399,
        currency: 'coins',
        rarity: 'epic',
        preview: '/emojis/animated-set.gif',
        features: ['动态效果', '流畅动画', '表情丰富', '高质量制作'],
        category: 'emojis',
        count: 25,
        animated: true
      }
    ],
    badges: [
      {
        id: 'badge_diamond_trader',
        name: '钻石交易者',
        description: '顶级交易者专属徽章',
        price: 999,
        currency: 'coins',
        rarity: 'legendary',
        preview: '/badges/diamond-trader.png',
        features: ['钻石等级', '专属标识', '尊贵身份', '稀有收藏'],
        category: 'badges',
        exclusive: true
      },
      {
        id: 'badge_profit_master',
        name: '盈利大师',
        description: '盈利能力认证徽章',
        price: 599,
        currency: 'coins',
        rarity: 'epic',
        preview: '/badges/profit-master.png',
        features: ['盈利认证', '技能展示', '成就象征', '专业标识'],
        category: 'badges'
      },
      {
        id: 'badge_community_star',
        name: '社区之星',
        description: '活跃社区成员徽章',
        price: 299,
        currency: 'coins',
        rarity: 'rare',
        preview: '/badges/community-star.png',
        features: ['社区认可', '活跃标识', '贡献奖励', '荣誉象征'],
        category: 'badges'
      }
    ],
    effects: [
      {
        id: 'effect_golden_rain',
        name: '黄金雨特效',
        description: '盈利时的黄金雨庆祝特效',
        price: 499,
        currency: 'coins',
        rarity: 'epic',
        preview: '/effects/golden-rain.gif',
        features: ['黄金粒子', '庆祝动画', '盈利触发', '视觉震撼'],
        category: 'effects',
        trigger: 'profit'
      },
      {
        id: 'effect_lightning_strike',
        name: '闪电打击',
        description: '快速交易时的闪电特效',
        price: 399,
        currency: 'coins',
        rarity: 'rare',
        preview: '/effects/lightning-strike.gif',
        features: ['闪电动画', '速度象征', '交易触发', '炫酷效果'],
        category: 'effects',
        trigger: 'trade'
      },
      {
        id: 'effect_fireworks',
        name: '烟花庆典',
        description: '重大成就时的烟花特效',
        price: 699,
        currency: 'coins',
        rarity: 'legendary',
        preview: '/effects/fireworks.gif',
        features: ['烟花绽放', '成就庆祝', '多彩效果', '节日氛围'],
        category: 'effects',
        trigger: 'achievement'
      }
    ],
    sounds: [
      {
        id: 'sound_success_chime',
        name: '成功提示音',
        description: '优雅的成功操作提示音',
        price: 99,
        currency: 'coins',
        rarity: 'common',
        preview: '/sounds/success-chime.mp3',
        features: ['清脆悦耳', '成功反馈', '心情愉悦', '专业制作'],
        category: 'sounds',
        duration: '2s'
      },
      {
        id: 'sound_profit_bell',
        name: '盈利铃声',
        description: '盈利时的庆祝铃声',
        price: 199,
        currency: 'coins',
        rarity: 'rare',
        preview: '/sounds/profit-bell.mp3',
        features: ['庆祝铃声', '盈利提醒', '激励效果', '高品质音效'],
        category: 'sounds',
        duration: '3s'
      },
      {
        id: 'sound_notification_pack',
        name: '通知音效包',
        description: '多种场景的通知音效合集',
        price: 299,
        currency: 'coins',
        rarity: 'epic',
        preview: '/sounds/notification-pack.mp3',
        features: ['10种音效', '场景丰富', '个性选择', '专业录制'],
        category: 'sounds',
        count: 10
      }
    ],
    features: [
      {
        id: 'feature_group_expand',
        name: '群组扩容包',
        description: '增加群组人数上限至500人',
        price: 499,
        currency: 'coins',
        rarity: 'rare',
        preview: '/features/group-expand.png',
        features: ['人数扩容', '管理增强', '功能升级', '永久有效'],
        category: 'features',
        benefit: '+300人'
      },
      {
        id: 'feature_message_pin',
        name: '消息置顶权限',
        description: '在群组中置顶重要消息的权限',
        price: 199,
        currency: 'coins',
        rarity: 'common',
        preview: '/features/message-pin.png',
        features: ['消息置顶', '重要提醒', '管理便利', '30天有效'],
        category: 'features',
        duration: '30天'
      },
      {
        id: 'feature_custom_status',
        name: '自定义状态',
        description: '设置个性化在线状态和签名',
        price: 299,
        currency: 'coins',
        rarity: 'rare',
        preview: '/features/custom-status.png',
        features: ['个性状态', '自定义签名', '表情符号', '永久有效'],
        category: 'features',
        benefit: '个性化'
      }
    ]
  };

  // 稀有度配置
  const rarityConfig = {
    common: { name: '普通', color: 'text-gray-600 bg-gray-100', border: 'border-gray-300' },
    rare: { name: '稀有', color: 'text-blue-600 bg-blue-100', border: 'border-blue-300' },
    epic: { name: '史诗', color: 'text-purple-600 bg-purple-100', border: 'border-purple-300' },
    legendary: { name: '传说', color: 'text-yellow-600 bg-yellow-100', border: 'border-yellow-300' }
  };

  const addToCart = (item) => {
    if (!ownedItems.includes(item.id)) {
      setCart(prev => {
        const existing = prev.find(cartItem => cartItem.id === item.id);
        if (existing) {
          return prev.map(cartItem => 
            cartItem.id === item.id 
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const purchaseItem = async (item) => {
    if (userCoins >= item.price && !ownedItems.includes(item.id)) {
      try {
        const response = await fetch('/api/virtual-goods/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            itemId: item.id,
            price: item.price
          })
        });

        if (response.ok) {
          setUserCoins(prev => prev - item.price);
          setOwnedItems(prev => [...prev, item.id]);
          removeFromCart(item.id);
        }
      } catch (error) {
        console.error('购买失败:', error);
      }
    }
  };

  const renderItemCard = (item) => {
    const rarity = rarityConfig[item.rarity];
    const isOwned = ownedItems.includes(item.id);
    const inCart = cart.some(cartItem => cartItem.id === item.id);

    return (
      <div key={item.id} className={`bg-white rounded-xl shadow-sm border-2 ${rarity.border} hover:shadow-lg transition-all duration-300 overflow-hidden`}>
        {/* 商品标签 */}
        <div className="relative">
          {item.popular && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                热门
              </span>
            </div>
          )}
          {item.limited && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                限量
              </span>
            </div>
          )}
          {item.vip && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                VIP
              </span>
            </div>
          )}
          
          {/* 商品预览 */}
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-6xl text-gray-400">
              {selectedCategory === 'themes' && <Palette />}
              {selectedCategory === 'avatars' && <Crown />}
              {selectedCategory === 'emojis' && <MessageCircle />}
              {selectedCategory === 'badges' && <Award />}
              {selectedCategory === 'effects' && <Sparkles />}
              {selectedCategory === 'sounds' && <Music />}
              {selectedCategory === 'features' && <Zap />}
            </div>
          </div>
        </div>

        {/* 商品信息 */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${rarity.color}`}>
              {rarity.name}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
          
          {/* 特性标签 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {feature}
              </span>
            ))}
            {item.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                +{item.features.length - 3}
              </span>
            )}
          </div>

          {/* 额外信息 */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            {item.animated && (
              <span className="flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                动态效果
              </span>
            )}
            {item.count && (
              <span className="flex items-center">
                <Gift className="w-3 h-3 mr-1" />
                {item.count}个
              </span>
            )}
            {item.duration && (
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {item.duration}
              </span>
            )}
          </div>

          {/* 价格和购买 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">{item.price}</span>
              <span className="text-sm text-gray-500 ml-1">金币</span>
            </div>
            
            {isOwned ? (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                已拥有
              </span>
            ) : (
              <div className="flex space-x-2">
                {!inCart ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                  >
                    加入购物车
                  </button>
                ) : (
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    移除
                  </button>
                )}
                <button
                  onClick={() => purchaseItem(item)}
                  disabled={userCoins < item.price}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    userCoins >= item.price
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  购买
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题和金币余额 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            虚拟商品商城
          </h1>
          <p className="text-gray-600">
            个性化您的交易体验，展现独特风格
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 金币余额 */}
          <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-lg">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">¥</span>
            </div>
            <span className="font-semibold text-gray-900">{userCoins.toLocaleString()}</span>
            <span className="text-sm text-gray-600 ml-1">金币</span>
          </div>
          
          {/* 购物车 */}
          <div className="relative">
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <ShoppingBag className="w-5 h-5 mr-2" />
              购物车
              {cart.length > 0 && (
                <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="flex space-x-2 mb-8 overflow-x-auto">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* 商品网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {virtualGoods[selectedCategory]?.map(renderItemCard)}
      </div>

      {/* 购买指南 */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">如何获得金币？</h2>
          <p className="text-gray-600">多种方式获得金币，购买心仪的虚拟商品</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">每日签到</h3>
            <p className="text-sm text-gray-600">每日签到获得10-50金币奖励</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">交易奖励</h3>
            <p className="text-sm text-gray-600">完成交易获得金币返还</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">推荐好友</h3>
            <p className="text-sm text-gray-600">推荐好友注册获得丰厚奖励</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">直接购买</h3>
            <p className="text-sm text-gray-600">使用现金购买金币充值包</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualGoodsStore;

