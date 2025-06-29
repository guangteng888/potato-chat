import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const TradingScreen = () => {
  const [selectedTab, setSelectedTab] = useState('portfolio');

  const portfolioData = {
    totalAssets: '¥128,456.78',
    todayProfit: '+¥2,345.67',
    todayProfitPercent: '+1.87%',
    holdings: 12,
  };

  const holdings = [
    {symbol: 'BTC', name: 'Bitcoin', amount: '0.5234', value: '¥89,234.56', change: '+5.67%', changeColor: '#4CAF50'},
    {symbol: 'ETH', name: 'Ethereum', amount: '2.1567', value: '¥23,456.78', change: '+3.45%', changeColor: '#4CAF50'},
    {symbol: 'ADA', name: 'Cardano', amount: '1000', value: '¥8,765.43', change: '-1.23%', changeColor: '#F44336'},
    {symbol: 'DOT', name: 'Polkadot', amount: '50', value: '¥7,000.01', change: '+2.34%', changeColor: '#4CAF50'},
  ];

  const marketData = [
    {symbol: 'BTC/USDT', price: '43,256.78', change: '+2.34%', changeColor: '#4CAF50', volume: '2.3B'},
    {symbol: 'ETH/USDT', price: '2,567.89', change: '+1.87%', changeColor: '#4CAF50', volume: '1.8B'},
    {symbol: 'BNB/USDT', price: '345.67', change: '-0.56%', changeColor: '#F44336', volume: '456M'},
    {symbol: 'ADA/USDT', price: '0.4567', change: '+3.45%', changeColor: '#4CAF50', volume: '234M'},
  ];

  const renderPortfolio = () => (
    <View>
      {/* Asset Overview */}
      <View style={styles.assetOverview}>
        <Text style={styles.totalAssetsLabel}>总资产</Text>
        <Text style={styles.totalAssetsValue}>{portfolioData.totalAssets}</Text>
        <View style={styles.profitContainer}>
          <Text style={[styles.profitText, {color: '#4CAF50'}]}>
            {portfolioData.todayProfit} ({portfolioData.todayProfitPercent})
          </Text>
          <Text style={styles.profitLabel}>今日收益</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{portfolioData.holdings}</Text>
          <Text style={styles.statLabel}>持仓数量</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>¥5,678</Text>
          <Text style={styles.statLabel}>可用余额</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>¥1,234</Text>
          <Text style={styles.statLabel}>冻结资金</Text>
        </View>
      </View>

      {/* Holdings List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>我的持仓</Text>
        {holdings.map((holding, index) => (
          <TouchableOpacity key={index} style={styles.holdingItem}>
            <View style={styles.holdingLeft}>
              <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
              <Text style={styles.holdingName}>{holding.name}</Text>
            </View>
            <View style={styles.holdingCenter}>
              <Text style={styles.holdingAmount}>{holding.amount}</Text>
              <Text style={styles.holdingValue}>{holding.value}</Text>
            </View>
            <View style={styles.holdingRight}>
              <Text style={[styles.holdingChange, {color: holding.changeColor}]}>
                {holding.change}
              </Text>
              <Icon name="chevron-right" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMarket = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>市场行情</Text>
      {marketData.map((item, index) => (
        <TouchableOpacity key={index} style={styles.marketItem}>
          <View style={styles.marketLeft}>
            <Text style={styles.marketSymbol}>{item.symbol}</Text>
            <Text style={styles.marketVolume}>成交量: {item.volume}</Text>
          </View>
          <View style={styles.marketRight}>
            <Text style={styles.marketPrice}>{item.price}</Text>
            <Text style={[styles.marketChange, {color: item.changeColor}]}>
              {item.change}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'portfolio' && styles.activeTab]}
          onPress={() => setSelectedTab('portfolio')}>
          <Text style={[styles.tabText, selectedTab === 'portfolio' && styles.activeTabText]}>
            资产
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'market' && styles.activeTab]}
          onPress={() => setSelectedTab('market')}>
          <Text style={[styles.tabText, selectedTab === 'market' && styles.activeTabText]}>
            市场
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'orders' && styles.activeTab]}
          onPress={() => setSelectedTab('orders')}>
          <Text style={[styles.tabText, selectedTab === 'orders' && styles.activeTabText]}>
            订单
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedTab === 'portfolio' && renderPortfolio()}
        {selectedTab === 'market' && renderMarket()}
        {selectedTab === 'orders' && (
          <View style={styles.emptyState}>
            <Icon name="assignment" size={64} color="#ccc" />
            <Text style={styles.emptyText}>暂无订单记录</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#4CAF50'}]}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>买入</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#F44336'}]}>
          <Icon name="remove" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>卖出</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  assetOverview: {
    backgroundColor: '#FF6B35',
    padding: 20,
    alignItems: 'center',
  },
  totalAssetsLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  totalAssetsValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  profitContainer: {
    alignItems: 'center',
  },
  profitText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profitLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 5,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  holdingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  holdingLeft: {
    flex: 1,
  },
  holdingSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  holdingName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  holdingCenter: {
    flex: 1,
    alignItems: 'flex-end',
  },
  holdingAmount: {
    fontSize: 14,
    color: '#333',
  },
  holdingValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  holdingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  holdingChange: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  marketLeft: {
    flex: 1,
  },
  marketSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  marketVolume: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  marketRight: {
    alignItems: 'flex-end',
  },
  marketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  marketChange: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default TradingScreen;

