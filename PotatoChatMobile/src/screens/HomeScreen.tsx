import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const cryptoData = [
    {symbol: 'BTC', name: 'Bitcoin', price: '$43,250', change: '+2.5%', isUp: true},
    {symbol: 'ETH', name: 'Ethereum', price: '$2,680', change: '+1.8%', isUp: true},
    {symbol: 'BNB', name: 'BNB', price: '$315', change: '-0.5%', isUp: false},
    {symbol: 'ADA', name: 'Cardano', price: '$0.52', change: '+3.2%', isUp: true},
  ];

  const quickActions = [
    {icon: 'chat', title: '聊天', color: '#4CAF50'},
    {icon: 'trending-up', title: '交易', color: '#FF9800'},
    {icon: 'account-balance-wallet', title: '钱包', color: '#2196F3'},
    {icon: 'notifications', title: '消息', color: '#9C27B0'},
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 欢迎区域 */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>欢迎回来！</Text>
        <Text style={styles.welcomeSubtext}>今天是个交易的好日子</Text>
      </View>

      {/* 快捷操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, {backgroundColor: action.color}]}>
                <Icon name={action.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 市场概览 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>市场概览</Text>
          <TouchableOpacity>
            <Text style={styles.moreText}>查看更多</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cryptoContainer}>
          {cryptoData.map((crypto, index) => (
            <TouchableOpacity key={index} style={styles.cryptoItem}>
              <View style={styles.cryptoInfo}>
                <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
                <Text style={styles.cryptoName}>{crypto.name}</Text>
              </View>
              <View style={styles.cryptoPriceInfo}>
                <Text style={styles.cryptoPrice}>{crypto.price}</Text>
                <Text style={[
                  styles.cryptoChange,
                  {color: crypto.isUp ? '#4CAF50' : '#F44336'}
                ]}>
                  {crypto.change}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* AI 助手 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI 投资助手</Text>
        <View style={styles.aiContainer}>
          <View style={styles.aiHeader}>
            <Icon name="psychology" size={24} color="#FF6B35" />
            <Text style={styles.aiTitle}>今日市场分析</Text>
          </View>
          <Text style={styles.aiContent}>
            根据当前市场数据分析，比特币突破关键阻力位，建议关注后续走势。以太坊表现稳定，适合长期持有。
          </Text>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiButtonText}>查看详细分析</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 最新动态 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最新动态</Text>
        <View style={styles.newsContainer}>
          <TouchableOpacity style={styles.newsItem}>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>比特币突破新高</Text>
              <Text style={styles.newsSubtitle}>市场情绪乐观，投资者信心增强</Text>
              <Text style={styles.newsTime}>2小时前</Text>
            </View>
            <Icon name="trending-up" size={20} color="#4CAF50" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.newsItem}>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>新功能上线</Text>
              <Text style={styles.newsSubtitle}>Potato Chat 新增智能交易功能</Text>
              <Text style={styles.newsTime}>5小时前</Text>
            </View>
            <Icon name="new-releases" size={20} color="#FF9800" />
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
  welcomeContainer: {
    backgroundColor: '#FF6B35',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  moreText: {
    color: '#FF6B35',
    fontSize: 14,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
  },
  cryptoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  cryptoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cryptoName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cryptoPriceInfo: {
    alignItems: 'flex-end',
  },
  cryptoPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cryptoChange: {
    fontSize: 12,
    marginTop: 2,
  },
  aiContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  aiContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  aiButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  newsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  newsContent: {
    flex: 1,
    marginRight: 12,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  newsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  newsTime: {
    fontSize: 10,
    color: '#999',
  },
});

export default HomeScreen;

