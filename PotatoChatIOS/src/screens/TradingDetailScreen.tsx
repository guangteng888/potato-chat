import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { LineChart } from 'react-native-chart-kit'
import { tradingActions, selectUser } from '../store/store'

interface TradingDetailScreenProps {
  navigation: any
  route: any
}

const TradingDetailScreen: React.FC<TradingDetailScreenProps> = ({ navigation, route }) => {
  const { tradingPair } = route.params
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D')
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  
  const dispatch = useDispatch()
  const currentUser = useSelector(selectUser)
  
  // 模拟价格数据
  const [priceData, setPriceData] = useState({
    symbol: tradingPair || 'BTC/USDT',
    price: 45250.50,
    change24h: 2.35,
    volume24h: 1234567890,
    high24h: 46800.00,
    low24h: 44100.00,
  })

  // 模拟K线数据
  const chartData = {
    labels: ['09:00', '12:00', '15:00', '18:00', '21:00', '00:00'],
    datasets: [{
      data: [44500, 45200, 44800, 45600, 45250, 45250],
      color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
      strokeWidth: 2,
    }],
  }

  const timeframes = ['1H', '4H', '1D', '1W', '1M']

  useEffect(() => {
    // 模拟实时价格更新
    const interval = setInterval(() => {
      setPriceData(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 100,
        change24h: prev.change24h + (Math.random() - 0.5) * 0.5,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleTrade = () => {
    if (!amount || !price) {
      Alert.alert('错误', '请输入交易数量和价格')
      return
    }

    const totalValue = parseFloat(amount) * parseFloat(price)
    
    Alert.alert(
      '确认交易',
      `${orderType === 'buy' ? '买入' : '卖出'} ${amount} ${priceData.symbol.split('/')[0]}\n价格: $${price}\n总价值: $${totalValue.toFixed(2)}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: () => {
            Alert.alert('成功', '交易订单已提交')
            setAmount('')
            setPrice('')
          }
        },
      ]
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B'
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <ScrollView style={styles.container}>
      {/* 价格信息 */}
      <View style={styles.priceSection}>
        <View style={styles.priceHeader}>
          <Text style={styles.symbol}>{priceData.symbol}</Text>
          <TouchableOpacity>
            <Icon name="star-outline" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.price}>${priceData.price.toFixed(2)}</Text>
        
        <View style={styles.priceChange}>
          <Icon 
            name={priceData.change24h >= 0 ? "trending-up" : "trending-down"} 
            size={16} 
            color={priceData.change24h >= 0 ? "#34C759" : "#FF3B30"} 
          />
          <Text style={[
            styles.changeText,
            { color: priceData.change24h >= 0 ? "#34C759" : "#FF3B30" }
          ]}>
            {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* 统计信息 */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h最高</Text>
          <Text style={styles.statValue}>${priceData.high24h.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h最低</Text>
          <Text style={styles.statValue}>${priceData.low24h.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h成交量</Text>
          <Text style={styles.statValue}>{formatNumber(priceData.volume24h)}</Text>
        </View>
      </View>

      {/* 时间框架选择 */}
      <View style={styles.timeframeSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timeframes.map((tf) => (
            <TouchableOpacity
              key={tf}
              style={[
                styles.timeframeButton,
                selectedTimeframe === tf && styles.timeframeButtonActive
              ]}
              onPress={() => setSelectedTimeframe(tf)}
            >
              <Text style={[
                styles.timeframeText,
                selectedTimeframe === tf && styles.timeframeTextActive
              ]}>
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 价格图表 */}
      <View style={styles.chartSection}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 30}
          height={200}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#FF6B35',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* 交易区域 */}
      <View style={styles.tradingSection}>
        <Text style={styles.sectionTitle}>交易</Text>
        
        {/* 买卖切换 */}
        <View style={styles.orderTypeSelector}>
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              styles.buyButton,
              orderType === 'buy' && styles.orderTypeButtonActive
            ]}
            onPress={() => setOrderType('buy')}
          >
            <Text style={[
              styles.orderTypeText,
              orderType === 'buy' && styles.orderTypeTextActive
            ]}>
              买入
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              styles.sellButton,
              orderType === 'sell' && styles.orderTypeButtonActive
            ]}
            onPress={() => setOrderType('sell')}
          >
            <Text style={[
              styles.orderTypeText,
              orderType === 'sell' && styles.orderTypeTextActive
            ]}>
              卖出
            </Text>
          </TouchableOpacity>
        </View>

        {/* 余额信息 */}
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>可用余额</Text>
          <Text style={styles.balanceValue}>
            {orderType === 'buy' 
              ? `$${currentUser?.balance.toFixed(2) || '0.00'} USDT`
              : `0.00 ${priceData.symbol.split('/')[0]}`
            }
          </Text>
        </View>

        {/* 交易表单 */}
        <View style={styles.tradingForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>价格 (USDT)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPrefix}>$</Text>
              <Text style={styles.input}>{priceData.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.inputSuffix}>
                <Text style={styles.inputSuffixText}>市价</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>数量 ({priceData.symbol.split('/')[0]})</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.input}>0.00</Text>
              <TouchableOpacity style={styles.inputSuffix}>
                <Text style={styles.inputSuffixText}>全部</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>总价值 (USDT)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPrefix}>$</Text>
              <Text style={styles.input}>0.00</Text>
            </View>
          </View>
        </View>

        {/* 交易按钮 */}
        <TouchableOpacity
          style={[
            styles.tradeButton,
            orderType === 'buy' ? styles.buyTradeButton : styles.sellTradeButton
          ]}
          onPress={handleTrade}
        >
          <Text style={styles.tradeButtonText}>
            {orderType === 'buy' ? '买入' : '卖出'} {priceData.symbol.split('/')[0]}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  priceSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  timeframeSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  timeframeButtonActive: {
    backgroundColor: '#FF6B35',
  },
  timeframeText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chartSection: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tradingSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 20,
  },
  orderTypeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  buyButton: {
    borderColor: '#34C759',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 0.5,
  },
  sellButton: {
    borderColor: '#FF3B30',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 0.5,
  },
  orderTypeButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  orderTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  orderTypeTextActive: {
    color: '#FFFFFF',
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  tradingForm: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  inputPrefix: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputSuffix: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  inputSuffixText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tradeButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyTradeButton: {
    backgroundColor: '#34C759',
  },
  sellTradeButton: {
    backgroundColor: '#FF3B30',
  },
  tradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
})

export default TradingDetailScreen

