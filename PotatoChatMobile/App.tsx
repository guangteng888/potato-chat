import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🥔 Potato Chat</Text>
        <Text style={styles.headerSubtitle}>社交金融一体化平台</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>欢迎使用 Potato Chat</Text>
          <Text style={styles.welcomeText}>
            集成聊天、交易、社交功能的一体化移动应用
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>核心功能</Text>
          
          <TouchableOpacity style={styles.featureItem}>
            <Text style={styles.featureIcon}>💬</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>即时聊天</Text>
              <Text style={styles.featureDescription}>
                与好友实时交流，分享投资心得
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureItem}>
            <Text style={styles.featureIcon}>📈</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>智能交易</Text>
              <Text style={styles.featureDescription}>
                AI辅助投资决策，把握市场机会
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>资产管理</Text>
              <Text style={styles.featureDescription}>
                一站式管理您的数字资产
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>安全保障</Text>
              <Text style={styles.featureDescription}>
                银行级安全防护，保障资金安全
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>平台数据</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100万+</Text>
              <Text style={styles.statLabel}>注册用户</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$50亿+</Text>
              <Text style={styles.statLabel}>交易额</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>99.9%</Text>
              <Text style={styles.statLabel}>系统稳定性</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>客服支持</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>立即开始使用</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Potato Chat Team</Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FF6B35',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  featureItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsGrid: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  ctaButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: '#999',
  },
});

export default App;

