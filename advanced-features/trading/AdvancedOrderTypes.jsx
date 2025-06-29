import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

const AdvancedOrderTypes = ({ symbol = 'BTC/USDT', currentPrice = 43250 }) => {
  const [orderType, setOrderType] = useState('limit')
  const [side, setSide] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [stopPrice, setStopPrice] = useState('')
  const [takeProfitPrice, setTakeProfitPrice] = useState('')
  const [stopLossPrice, setStopLossPrice] = useState('')
  const [timeInForce, setTimeInForce] = useState('GTC')
  const [reduceOnly, setReduceOnly] = useState(false)
  const [postOnly, setPostOnly] = useState(false)
  const [iceberg, setIceberg] = useState(false)
  const [icebergQty, setIcebergQty] = useState('')
  const [trailingPercent, setTrailingPercent] = useState([2])

  // 订单类型配置
  const orderTypes = {
    market: {
      name: '市价单',
      description: '立即以市场最优价格执行',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-blue-500'
    },
    limit: {
      name: '限价单',
      description: '指定价格执行，可能不会立即成交',
      icon: <Target className="w-4 h-4" />,
      color: 'bg-green-500'
    },
    stopMarket: {
      name: '止损市价单',
      description: '触发价格后转为市价单',
      icon: <Shield className="w-4 h-4" />,
      color: 'bg-red-500'
    },
    stopLimit: {
      name: '止损限价单',
      description: '触发价格后转为限价单',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'bg-orange-500'
    },
    takeProfit: {
      name: '止盈单',
      description: '达到目标价格时自动平仓',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'bg-emerald-500'
    },
    trailingStop: {
      name: '跟踪止损',
      description: '动态调整止损价格',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-purple-500'
    },
    oco: {
      name: 'OCO订单',
      description: '一个取消另一个订单',
      icon: <XCircle className="w-4 h-4" />,
      color: 'bg-indigo-500'
    },
    bracket: {
      name: '括号订单',
      description: '同时设置止盈和止损',
      icon: <Target className="w-4 h-4" />,
      color: 'bg-pink-500'
    }
  }

  // 时间有效性选项
  const timeInForceOptions = {
    GTC: { name: 'Good Till Cancel', description: '直到取消' },
    IOC: { name: 'Immediate or Cancel', description: '立即成交或取消' },
    FOK: { name: 'Fill or Kill', description: '全部成交或取消' },
    GTD: { name: 'Good Till Date', description: '指定日期前有效' }
  }

  // 计算订单价值
  const calculateOrderValue = () => {
    const qty = parseFloat(quantity) || 0
    const orderPrice = orderType === 'market' ? currentPrice : (parseFloat(price) || 0)
    return qty * orderPrice
  }

  // 计算手续费
  const calculateFee = () => {
    const value = calculateOrderValue()
    const feeRate = postOnly ? 0.001 : 0.0015 // Maker/Taker费率
    return value * feeRate
  }

  // 风险评估
  const getRiskLevel = () => {
    if (orderType === 'market') return { level: 'high', color: 'text-red-600', text: '高风险' }
    if (orderType === 'limit' && postOnly) return { level: 'low', color: 'text-green-600', text: '低风险' }
    return { level: 'medium', color: 'text-yellow-600', text: '中等风险' }
  }

  const handleSubmitOrder = () => {
    const orderData = {
      symbol,
      side,
      type: orderType,
      quantity: parseFloat(quantity),
      price: orderType !== 'market' ? parseFloat(price) : undefined,
      stopPrice: stopPrice ? parseFloat(stopPrice) : undefined,
      takeProfitPrice: takeProfitPrice ? parseFloat(takeProfitPrice) : undefined,
      stopLossPrice: stopLossPrice ? parseFloat(stopLossPrice) : undefined,
      timeInForce,
      reduceOnly,
      postOnly,
      iceberg: iceberg ? parseFloat(icebergQty) : undefined,
      trailingPercent: orderType === 'trailingStop' ? trailingPercent[0] : undefined,
      timestamp: Date.now()
    }

    console.log('提交高级订单:', orderData)
    // 这里会调用API提交订单
  }

  return (
    <div className="space-y-6">
      {/* 订单类型选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>高级订单类型</span>
          </CardTitle>
          <CardDescription>
            选择适合您交易策略的订单类型
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(orderTypes).map(([key, config]) => (
              <Button
                key={key}
                variant={orderType === key ? 'default' : 'outline'}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  orderType === key ? config.color : ''
                }`}
                onClick={() => setOrderType(key)}
              >
                {config.icon}
                <div className="text-center">
                  <div className="font-medium text-sm">{config.name}</div>
                  <div className="text-xs opacity-70">{config.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 订单参数设置 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基础参数 */}
        <Card>
          <CardHeader>
            <CardTitle>订单参数</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 买卖方向 */}
            <div className="space-y-2">
              <Label>交易方向</Label>
              <div className="flex space-x-2">
                <Button
                  variant={side === 'buy' ? 'default' : 'outline'}
                  className={side === 'buy' ? 'bg-green-500 hover:bg-green-600' : ''}
                  onClick={() => setSide('buy')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  买入
                </Button>
                <Button
                  variant={side === 'sell' ? 'default' : 'outline'}
                  className={side === 'sell' ? 'bg-red-500 hover:bg-red-600' : ''}
                  onClick={() => setSide('sell')}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  卖出
                </Button>
              </div>
            </div>

            {/* 数量 */}
            <div className="space-y-2">
              <Label htmlFor="quantity">数量</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="输入交易数量"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {/* 价格 (非市价单) */}
            {orderType !== 'market' && (
              <div className="space-y-2">
                <Label htmlFor="price">价格</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={`当前价格: $${currentPrice}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            {/* 止损价格 */}
            {['stopMarket', 'stopLimit', 'bracket'].includes(orderType) && (
              <div className="space-y-2">
                <Label htmlFor="stopPrice">触发价格</Label>
                <Input
                  id="stopPrice"
                  type="number"
                  placeholder="止损触发价格"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                />
              </div>
            )}

            {/* 跟踪止损百分比 */}
            {orderType === 'trailingStop' && (
              <div className="space-y-2">
                <Label>跟踪百分比: {trailingPercent[0]}%</Label>
                <Slider
                  value={trailingPercent}
                  onValueChange={setTrailingPercent}
                  max={10}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 高级选项 */}
        <Card>
          <CardHeader>
            <CardTitle>高级选项</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 时间有效性 */}
            <div className="space-y-2">
              <Label>时间有效性</Label>
              <Select value={timeInForce} onValueChange={setTimeInForce}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(timeInForceOptions).map(([key, option]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 高级选项开关 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>只减仓</Label>
                  <p className="text-sm text-gray-500">仅用于减少现有仓位</p>
                </div>
                <Switch checked={reduceOnly} onCheckedChange={setReduceOnly} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>只做Maker</Label>
                  <p className="text-sm text-gray-500">享受更低手续费</p>
                </div>
                <Switch checked={postOnly} onCheckedChange={setPostOnly} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>冰山订单</Label>
                  <p className="text-sm text-gray-500">隐藏大额订单</p>
                </div>
                <Switch checked={iceberg} onCheckedChange={setIceberg} />
              </div>
            </div>

            {/* 冰山订单数量 */}
            {iceberg && (
              <div className="space-y-2">
                <Label htmlFor="icebergQty">显示数量</Label>
                <Input
                  id="icebergQty"
                  type="number"
                  placeholder="每次显示的数量"
                  value={icebergQty}
                  onChange={(e) => setIcebergQty(e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* OCO和括号订单特殊设置 */}
      {['oco', 'bracket'].includes(orderType) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {orderType === 'oco' ? 'OCO订单设置' : '括号订单设置'}
            </CardTitle>
            <CardDescription>
              {orderType === 'oco' 
                ? '设置止盈和止损价格，其中一个成交后另一个自动取消'
                : '同时设置止盈和止损，实现风险控制'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="takeProfitPrice">止盈价格</Label>
                <Input
                  id="takeProfitPrice"
                  type="number"
                  placeholder="目标盈利价格"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stopLossPrice">止损价格</Label>
                <Input
                  id="stopLossPrice"
                  type="number"
                  placeholder="风险控制价格"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 订单摘要 */}
      <Card>
        <CardHeader>
          <CardTitle>订单摘要</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-sm text-gray-500">交易对</Label>
              <p className="font-medium">{symbol}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">订单价值</Label>
              <p className="font-medium">${calculateOrderValue().toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">预估手续费</Label>
              <p className="font-medium">${calculateFee().toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">风险等级</Label>
              <Badge className={getRiskLevel().color}>
                {getRiskLevel().text}
              </Badge>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubmitOrder}
            disabled={!quantity || (orderType !== 'market' && !price)}
          >
            <Clock className="w-4 h-4 mr-2" />
            提交{orderTypes[orderType]?.name}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedOrderTypes

