import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { MessageCircle, TrendingUp, Wallet, User, Star, Shield, Zap, Globe } from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🥔</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Potato Chat</h1>
                <p className="text-sm text-gray-600">社交金融一体化平台</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                v1.0.0
              </Badge>
              <Button variant="outline" size="sm">
                登录
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                注册
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>主页</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>聊天</span>
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>交易</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>个人中心</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white">
              <h2 className="text-4xl font-bold mb-4">欢迎使用 Potato Chat</h2>
              <p className="text-xl mb-8 opacity-90">集成聊天、交易、社交功能的一体化平台</p>
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                立即开始使用
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                  <CardTitle>即时聊天</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    与好友实时交流，分享投资心得，支持群组聊天和语音通话
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                  <CardTitle>智能交易</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    AI辅助投资决策，实时市场数据，智能风险控制
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Wallet className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                  <CardTitle>资产管理</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    一站式管理您的数字资产，多币种支持，安全可靠
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Shield className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                  <CardTitle>安全保障</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    银行级安全防护，多重身份验证，保障资金安全
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">平台数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-orange-500 mb-2">100万+</div>
                    <div className="text-gray-600">注册用户</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-500 mb-2">$50亿+</div>
                    <div className="text-gray-600">交易额</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-500 mb-2">99.9%</div>
                    <div className="text-gray-600">系统稳定性</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                    <div className="text-gray-600">客服支持</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-6 h-6 text-orange-500" />
                  <span>聊天功能</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">实时聊天</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 与好友实时交流</li>
                        <li>• 群组聊天功能</li>
                        <li>• 分享投资心得</li>
                        <li>• 语音和视频通话</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">智能助手</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• AI投资建议</li>
                        <li>• 市场分析报告</li>
                        <li>• 风险评估提醒</li>
                        <li>• 个性化推荐</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">聊天演示</h4>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">A</div>
                        <span className="font-medium text-sm">Alice</span>
                        <span className="text-xs text-gray-500">10:30</span>
                      </div>
                      <p className="text-sm">今天BTC的走势怎么样？</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">B</div>
                        <span className="font-medium text-sm">Bob</span>
                        <span className="text-xs text-gray-500">10:32</span>
                      </div>
                      <p className="text-sm">看起来有上涨趋势，建议关注支撑位</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  <span>智能交易</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">总资产</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">$12,345.67</div>
                      <div className="text-sm text-green-600">+$234.56 (+1.92%)</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">今日收益</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">+$234.56</div>
                      <div className="text-sm text-gray-600">收益率: +1.92%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">持仓数量</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-gray-600">个投资组合</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>交易功能</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">核心功能</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• AI辅助投资决策</li>
                          <li>• 实时市场数据</li>
                          <li>• 智能风险控制</li>
                          <li>• 多种交易工具</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">高级功能</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• 量化交易策略</li>
                          <li>• 自动止盈止损</li>
                          <li>• 投资组合优化</li>
                          <li>• 风险评估报告</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-orange-500" />
                  <span>个人中心</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">用户信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">用户名:</span>
                        <span className="font-medium">potato_trader</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">邮箱:</span>
                        <span className="font-medium">user@potatochat.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">注册时间:</span>
                        <span className="font-medium">2025-01-01</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">会员等级:</span>
                        <Badge className="bg-orange-500">VIP</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">账户统计</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">总交易次数:</span>
                        <span className="font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">成功率:</span>
                        <span className="font-medium text-green-600">78.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">总收益:</span>
                        <span className="font-medium text-green-600">+$5,678.90</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">风险等级:</span>
                        <Badge variant="outline">中等</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>设置选项</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        账户安全设置
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Zap className="w-4 h-4 mr-2" />
                        通知偏好设置
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <User className="w-4 h-4 mr-2" />
                        隐私设置
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Star className="w-4 h-4 mr-2" />
                        帮助与支持
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">© 2025 Potato Chat Team. All rights reserved.</p>
            <p className="text-sm text-gray-500">社交金融一体化平台 - 让投资更智能，让社交更有价值</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

