import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TradingScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('43250');

  const cryptoData = [
    {symbol: 'BTC', name: 'Bitcoin', price: 43250, change: 2.5, volume: '1.2B'},
    {symbol: 'ETH', name: 'Ethereum', price: 2680, change: 1.8, volume: '800M'},
    {symbol: 'BNB', name: 'BNB', price: 315, change: -0.5, volume: '200M'},
    {symbol: 'ADA', name: 'Cardano', price: 0.52, change: 3.2, volume: '150M'},
  ];

  const portfolio = [
    {symbol: 'BTC', amount: 0.023, value: 994.75, change: 2.5},
    {symbol: 'ETH', amount: 0.5, value: 1340, change: 1.8},
    {symbol: 'USDT', amount: 1000, value: 1000, change: 0},
  ];

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('错误', '请输入有效的交易数量');
      return;
    }

    const total = parseFloat(amount) * parseFloat(price);
    Alert.alert(
      '确认交易',
      `${activeTab === 'buy' ? '买入' : '卖出'} ${amount} BTC\n价格: $${price}\n总额: $${total.toFixed(2)}`,
      [
        {text: '取消', style: 'cancel'},
        {text: '确认', onPress: () => {
          Alert.alert('成功', '交易已提交');
          setAmount('');
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 市场概览 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>市场行情</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.marketContainer}>
            {cryptoData.map((crypto, index) => (
              <TouchableOpacity key={index} style={styles.marketItem}>
                <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
                <Text style={styles.cryptoPrice}>${crypto.price.toLocaleString()}</Text>
                <Text style={[
                  styles.cryptoChange,
                  {color: crypto.change >= 0 ? '#4CAF50' : '#F44336'}
                ]}>
                  {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                </Text>
                <Text style={styles.cryptoVolume}>24h: {crypto.volume}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 交易面板 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>交易 BTC/USDT</Text>
        <View style={styles.tradingPanel}>
          {/* 买卖切换 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'buy' && styles.buyTab]}
              onPress={() => setActiveTab('buy')}>
              <Text style={[
                styles.tabText,
                activeTab === 'buy' && styles.buyTabText
              ]}>
                买入
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'sell' && styles.sellTab]}
              onPress={() => setActiveTab('sell')}>
              <Text style={[
                styles.tabText,
                activeTab === 'sell' && styles.sellTabText
              ]}>
                卖出
              </Text>
            </TouchableOpacity>
          </View>

          {/* 交易表单 */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>价格 (USDT)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="输入价格"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>数量 (BTC)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="输入数量"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>总额 (USDT)</Text>
              <Text style={styles.totalAmount}>
                {amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.tradeButton,
                activeTab === 'buy' ? styles.buyButton : styles.sellButton
              ]}
              onPress={handleTrade}>
              <Text style={styles.tradeButtonText}>
                {activeTab === 'buy' ? '买入 BTC' : '卖出 BTC'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 我的资产 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>我的资产</Text>
        <View style={styles.portfolioContainer}>
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioTotal}>总价值: $3,334.75</Text>
            <Text style={styles.portfolioChange}>+2.1% (24h)</Text>
          </View>
          
          {portfolio.map((asset, index) => (
            <View key={index} style={styles.portfolioItem}>
              <View style={styles.assetInfo}>
                <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                <Text style={styles.assetAmount}>{asset.amount}</Text>
              </View>
              <View style={styles.assetValue}>
                <Text style={styles.assetPrice}>${asset.value.toFixed(2)}</Text>
                <Text style={[
                  styles.assetChange,
                  {color: asset.change >= 0 ? '#4CAF50' : '#F44336'}
                ]}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 快捷操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="account-balance-wallet" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>充值</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="send" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>提现</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="history" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>历史</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="help" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>帮助</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  marketContainer: {
    flexDirection: 'row',
  },
  marketItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cryptoPrice: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  cryptoChange: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cryptoVolume: {
    fontSize: 10,
    color: '#666',
  },
  tradingPanel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
  },
  buyTab: {
    backgroundColor: '#4CAF50',
  },
  sellTab: {
    backgroundColor: '#F44336',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  buyTabText: {
    color: '#fff',
  },
  sellTabText: {
    color: '#fff',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  tradeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#F44336',
  },
  tradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  portfolioContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  portfolioTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  portfolioChange: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  portfolioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  assetInfo: {
    flex: 1,
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  assetAmount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  assetValue: {
    alignItems: 'flex-end',
  },
  assetPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  assetChange: {
    fontSize: 12,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
  },
});

export default TradingScreen;

