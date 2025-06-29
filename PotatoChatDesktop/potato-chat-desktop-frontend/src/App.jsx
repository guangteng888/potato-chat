import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Input } from '@/components/ui/input.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { 
  MessageCircle, 
  TrendingUp, 
  User, 
  Home, 
  Settings, 
  Bell,
  Search,
  Send,
  Bitcoin,
  DollarSign,
  BarChart3,
  Users,
  Shield,
  Zap
} from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [appVersion, setAppVersion] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, user: '小明', message: '大家好！今天BTC行情不错啊', time: '10:30', avatar: '👨' },
    { id: 2, user: '小红', message: '是的，我刚买了一些，希望能继续上涨', time: '10:32', avatar: '👩' },
    { id: 3, user: '交易专家', message: '建议大家理性投资，注意风险控制', time: '10:35', avatar: '🧑‍💼' }
  ])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // 获取应用版本信息
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then(version => {
        setAppVersion(version)
      })
    }
  }, [])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: '我',
        message: newMessage,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        avatar: '😊'
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const cryptoPrices = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$43,250', change: '+2.5%', trend: 'up' },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,680', change: '+1.8%', trend: 'up' },
    { symbol: 'BNB', name: 'BNB', price: '$315', change: '-0.5%', trend: 'down' },
    { symbol: 'ADA', name: 'Cardano', price: '$0.52', change: '+3.2%', trend: 'up' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* 顶部导航栏 */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🥔</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Potato Chat</h1>
            <Badge variant="secondary" className="text-xs">桌面版 v{appVersion}</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 侧边导航 */}
        <aside className="w-64 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 p-4">
          <nav className="space-y-2">
            <Button 
              variant={activeTab === 'home' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('home')}
            >
              <Home className="w-4 h-4 mr-2" />
              主页
            </Button>
            <Button 
              variant={activeTab === 'chat' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('chat')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              聊天
            </Button>
            <Button 
              variant={activeTab === 'trading' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('trading')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              交易
            </Button>
            <Button 
              variant={activeTab === 'profile' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-4 h-4 mr-2" />
              个人中心
            </Button>
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">欢迎使用 Potato Chat 桌面版</h2>
                <p className="text-gray-600 dark:text-gray-300">社交金融一体化平台，让聊天和交易更简单</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">在线用户</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+20.1% 较昨日</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">今日交易量</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231</div>
                    <p className="text-xs text-muted-foreground">+15.3% 较昨日</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">活跃聊天室</CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89</div>
                    <p className="text-xs text-muted-foreground">+5.2% 较昨日</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">系统状态</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">正常</div>
                    <p className="text-xs text-muted-foreground">99.9% 可用性</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>实时行情</CardTitle>
                    <CardDescription>加密货币价格动态</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cryptoPrices.map((crypto) => (
                        <div key={crypto.symbol} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Bitcoin className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">{crypto.symbol}</p>
                              <p className="text-sm text-gray-500">{crypto.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{crypto.price}</p>
                            <p className={`text-sm ${crypto.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                              {crypto.change}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI 助手</CardTitle>
                    <CardDescription>智能投资建议和市场分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900 dark:text-blue-100">市场提醒</p>
                            <p className="text-sm text-blue-700 dark:text-blue-200">
                              BTC突破关键阻力位，建议关注后续走势
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900 dark:text-green-100">投资建议</p>
                            <p className="text-sm text-green-700 dark:text-green-200">
                              当前市场情绪乐观，适合逢低布局优质项目
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">聊天室</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="搜索聊天记录..." className="pl-10" />
                  </div>
                  <Button>新建聊天</Button>
                </div>
              </div>

              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>💰</span>
                    <span>加密货币交流群</span>
                    <Badge variant="secondary">1,234 人在线</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                            {msg.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{msg.user}</span>
                              <span className="text-xs text-gray-500">{msg.time}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="输入消息..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'trading' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">加密货币交易</h2>
                <p className="text-gray-600 dark:text-gray-300">专业的数字资产交易平台</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>交易面板</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="buy" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="buy">买入</TabsTrigger>
                          <TabsTrigger value="sell">卖出</TabsTrigger>
                        </TabsList>
                        <TabsContent value="buy" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">交易对</label>
                              <Input value="BTC/USDT" readOnly />
                            </div>
                            <div>
                              <label className="text-sm font-medium">价格</label>
                              <Input placeholder="43,250" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">数量</label>
                              <Input placeholder="0.001" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">总额</label>
                              <Input placeholder="43.25" />
                            </div>
                          </div>
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            买入 BTC
                          </Button>
                        </TabsContent>
                        <TabsContent value="sell" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">交易对</label>
                              <Input value="BTC/USDT" readOnly />
                            </div>
                            <div>
                              <label className="text-sm font-medium">价格</label>
                              <Input placeholder="43,250" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">数量</label>
                              <Input placeholder="0.001" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">总额</label>
                              <Input placeholder="43.25" />
                            </div>
                          </div>
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            卖出 BTC
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>我的资产</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">USDT</span>
                          <span className="font-medium">1,000.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">BTC</span>
                          <span className="font-medium">0.023</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">ETH</span>
                          <span className="font-medium">0.5</span>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">总价值</span>
                            <span className="font-bold text-lg">$2,340.50</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">个人中心</h2>
                <p className="text-gray-600 dark:text-gray-300">管理您的账户信息和设置</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>个人信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="/api/placeholder/64/64" />
                        <AvatarFallback>用户</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Potato用户</h3>
                        <p className="text-sm text-gray-500">potato@example.com</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium">用户名</label>
                        <Input value="potato_user" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">邮箱</label>
                        <Input value="potato@example.com" />
                      </div>
                    </div>
                    <Button className="w-full">更新信息</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>安全设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">两步验证</span>
                      <Badge variant="secondary">已启用</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">登录通知</span>
                      <Badge variant="secondary">已启用</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">交易密码</span>
                      <Badge variant="secondary">已设置</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      修改密码
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>应用设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">桌面通知</span>
                      <Badge variant="secondary">已启用</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">声音提醒</span>
                      <Badge variant="secondary">已启用</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">自动启动</span>
                      <Badge variant="outline">已禁用</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      应用设置
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App

