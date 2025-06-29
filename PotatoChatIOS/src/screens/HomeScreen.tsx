import React from 'react';
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

const HomeScreen = () => {
  const features = [
    {
      icon: 'chat',
      title: '即时聊天',
      description: '与好友实时交流，分享投资心得',
      color: '#4CAF50',
    },
    {
      icon: 'trending-up',
      title: '智能交易',
      description: 'AI辅助投资决策，实时市场数据',
      color: '#2196F3',
    },
    {
      icon: 'account-balance-wallet',
      title: '资产管理',
      description: '一站式管理您的数字资产',
      color: '#FF9800',
    },
    {
      icon: 'security',
      title: '安全保障',
      description: '银行级安全防护，保障资金安全',
      color: '#9C27B0',
    },
  ];

  const stats = [
    {label: '注册用户', value: '100万+', color: '#FF6B35'},
    {label: '交易额', value: '$50亿+', color: '#4CAF50'},
    {label: '系统稳定性', value: '99.9%', color: '#2196F3'},
    {label: '客服支持', value: '24/7', color: '#FF9800'},
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>欢迎使用 Potato Chat</Text>
        <Text style={styles.heroSubtitle}>
          集成聊天、交易、社交功能的一体化平台
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>立即开始使用</Text>
        </TouchableOpacity>
      </View>

      {/* Features Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>核心功能</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, {backgroundColor: feature.color}]}>
                <Icon name={feature.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>平台数据</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={[styles.statValue, {color: stat.color}]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* News Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最新动态</Text>
        <View style={styles.newsCard}>
          <Text style={styles.newsTitle}>🎉 Potato Chat iOS版本正式发布</Text>
          <Text style={styles.newsContent}>
            全新的iOS应用带来更流畅的用户体验，支持所有核心功能。
          </Text>
          <Text style={styles.newsTime}>2小时前</Text>
        </View>
        <View style={styles.newsCard}>
          <Text style={styles.newsTitle}>📈 新增AI投资助手功能</Text>
          <Text style={styles.newsContent}>
            智能分析市场趋势，为您提供个性化投资建议。
          </Text>
          <Text style={styles.newsTime}>1天前</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroSection: {
    backgroundColor: '#FF6B35',
    padding: 30,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  newsCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  newsContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  newsTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;

