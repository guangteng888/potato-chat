import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  Layers,
  Settings,
  Download,
  Share,
  Maximize,
  Eye,
  AlertCircle
} from 'lucide-react'

const TradingViewChart = ({ symbol = 'BTCUSDT', height = 600 }) => {
  const chartContainerRef = useRef(null)
  const [interval, setInterval] = useState('1h')
  const [chartType, setChartType] = useState('candlestick')
  const [indicators, setIndicators] = useState(['MA', 'RSI'])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [marketData, setMarketData] = useState({
    price: 43250.50,
    change24h: 2.45,
    volume24h: 28500000000,
    high24h: 44100,
    low24h: 42800
  })

  // 时间间隔选项
  const intervals = [
    { value: '1m', label: '1分钟' },
    { value: '5m', label: '5分钟' },
    { value: '15m', label: '15分钟' },
    { value: '1h', label: '1小时' },
    { value: '4h', label: '4小时' },
    { value: '1d', label: '1天' },
    { value: '1w', label: '1周' },
    { value: '1M', label: '1月' }
  ]

  // 图表类型选项
  const chartTypes = [
    { value: 'candlestick', label: 'K线图', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'line', label: '线形图', icon: <Activity className="w-4 h-4" /> },
    { value: 'area', label: '面积图', icon: <Layers className="w-4 h-4" /> },
    { value: 'heikinashi', label: '平均K线', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  // 技术指标选项
  const availableIndicators = [
    { value: 'MA', label: '移动平均线', category: 'trend' },
    { value: 'EMA', label: '指数移动平均', category: 'trend' },
    { value: 'BOLL', label: '布林带', category: 'volatility' },
    { value: 'RSI', label: 'RSI', category: 'momentum' },
    { value: 'MACD', label: 'MACD', category: 'momentum' },
    { value: 'KDJ', label: 'KDJ', category: 'momentum' },
    { value: 'VOL', label: '成交量', category: 'volume' },
    { value: 'OBV', label: 'OBV', category: 'volume' },
    { value: 'SAR', label: '抛物线SAR', category: 'trend' },
    { value: 'ATR', label: '真实波幅', category: 'volatility' }
  ]

  // 模拟K线数据
  const generateKlineData = () => {
    const data = []
    let basePrice = 43000
    const now = Date.now()
    
    for (let i = 100; i >= 0; i--) {
      const timestamp = now - i * 3600000 // 1小时间隔
      const open = basePrice + (Math.random() - 0.5) * 1000
      const close = open + (Math.random() - 0.5) * 500
      const high = Math.max(open, close) + Math.random() * 200
      const low = Math.min(open, close) - Math.random() * 200
      const volume = Math.random() * 1000000
      
      data.push({
        timestamp,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: parseFloat(volume.toFixed(2))
      })
      
      basePrice = close
    }
    
    return data
  }

  const [klineData, setKlineData] = useState(generateKlineData())

  // 技术分析计算
  const calculateMA = (data, period = 20) => {
    return data.map((item, index) => {
      if (index < period - 1) return { ...item, ma: null }
      
      const sum = data.slice(index - period + 1, index + 1)
        .reduce((acc, curr) => acc + curr.close, 0)
      
      return { ...item, ma: sum / period }
    })
  }

  const calculateRSI = (data, period = 14) => {
    return data.map((item, index) => {
      if (index < period) return { ...item, rsi: null }
      
      const changes = data.slice(index - period + 1, index + 1)
        .map((curr, i, arr) => i === 0 ? 0 : curr.close - arr[i - 1].close)
      
      const gains = changes.filter(change => change > 0)
      const losses = changes.filter(change => change < 0).map(loss => Math.abs(loss))
      
      const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period
      const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period
      
      const rs = avgGain / avgLoss
      const rsi = 100 - (100 / (1 + rs))
      
      return { ...item, rsi: parseFloat(rsi.toFixed(2)) }
    })
  }

  // 绘制图表
  const drawChart = () => {
    if (!chartContainerRef.current) return

    const canvas = chartContainerRef.current
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 设置样式
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    
    // 垂直网格线
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // 水平网格线
    for (let i = 0; i <= 8; i++) {
      const y = (height / 8) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 计算价格范围
    const prices = klineData.map(item => [item.high, item.low]).flat()
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const priceRange = maxPrice - minPrice

    // 绘制K线
    const candleWidth = width / klineData.length * 0.8
    
    klineData.forEach((item, index) => {
      const x = (width / klineData.length) * index + candleWidth / 2
      const openY = height - ((item.open - minPrice) / priceRange) * height
      const closeY = height - ((item.close - minPrice) / priceRange) * height
      const highY = height - ((item.high - minPrice) / priceRange) * height
      const lowY = height - ((item.low - minPrice) / priceRange) * height

      // 绘制影线
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // 绘制实体
      const isRising = item.close > item.open
      ctx.fillStyle = isRising ? '#10b981' : '#ef4444'
      ctx.fillRect(
        x - candleWidth / 2,
        Math.min(openY, closeY),
        candleWidth,
        Math.abs(closeY - openY) || 1
      )
    })

    // 绘制移动平均线
    if (indicators.includes('MA')) {
      const maData = calculateMA(klineData)
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      maData.forEach((item, index) => {
        if (item.ma) {
          const x = (width / klineData.length) * index + candleWidth / 2
          const y = height - ((item.ma - minPrice) / priceRange) * height
          
          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      })
      ctx.stroke()
    }

    // 绘制价格标签
    ctx.fillStyle = '#f3f4f6'
    ctx.font = '12px Arial'
    ctx.textAlign = 'right'
    
    for (let i = 0; i <= 8; i++) {
      const price = minPrice + (priceRange / 8) * i
      const y = height - (height / 8) * i
      ctx.fillText(price.toFixed(2), width - 10, y + 4)
    }
  }

  useEffect(() => {
    drawChart()
  }, [klineData, indicators, chartType])

  useEffect(() => {
    const canvas = chartContainerRef.current
    if (canvas) {
      canvas.width = canvas.offsetWidth
      canvas.height = height
      drawChart()
    }
  }, [])

  const toggleIndicator = (indicator) => {
    setIndicators(prev => 
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    )
  }

  const exportChart = () => {
    const canvas = chartContainerRef.current
    const link = document.createElement('a')
    link.download = `${symbol}_chart_${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-4">
      {/* 市场数据概览 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-bold">{symbol}</h3>
              <div className="text-2xl font-bold">
                ${marketData.price.toLocaleString()}
              </div>
              <Badge 
                variant={marketData.change24h >= 0 ? 'default' : 'destructive'}
                className={marketData.change24h >= 0 ? 'bg-green-500' : 'bg-red-500'}
              >
                {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h}%
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div>24h高: ${marketData.high24h.toLocaleString()}</div>
              <div>24h低: ${marketData.low24h.toLocaleString()}</div>
              <div>24h量: ${(marketData.volume24h / 1000000000).toFixed(2)}B</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 图表控制面板 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 时间间隔 */}
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {intervals.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 图表类型 */}
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        {type.icon}
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 技术指标 */}
              <div className="flex items-center space-x-2">
                {availableIndicators.slice(0, 6).map(indicator => (
                  <Button
                    key={indicator.value}
                    variant={indicators.includes(indicator.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleIndicator(indicator.value)}
                  >
                    {indicator.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportChart}>
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize className="w-4 h-4 mr-2" />
                全屏
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主图表区域 */}
      <Card className={isFullscreen ? 'fixed inset-0 z-50' : ''}>
        <CardContent className="p-0">
          <canvas
            ref={chartContainerRef}
            className="w-full"
            style={{ height: isFullscreen ? '100vh' : `${height}px` }}
          />
        </CardContent>
      </Card>

      {/* 技术分析面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* RSI指标 */}
        {indicators.includes('RSI') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">RSI (14)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>当前值</span>
                  <span className="font-medium">65.4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: '65.4%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>超卖(30)</span>
                  <span>超买(70)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MACD指标 */}
        {indicators.includes('MACD') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">MACD</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>MACD</span>
                  <span className="font-medium text-green-600">+125.6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>信号线</span>
                  <span className="font-medium">98.2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>柱状图</span>
                  <span className="font-medium text-green-600">+27.4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 交易信号 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              交易信号
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">趋势</span>
                <Badge className="bg-green-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  看涨
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">强度</span>
                <span className="text-sm font-medium">中等</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">建议</span>
                <span className="text-sm text-green-600">逢低买入</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TradingViewChart

