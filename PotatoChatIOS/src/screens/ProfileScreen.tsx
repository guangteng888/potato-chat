import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const menuItems = [
    {
      section: '账户管理',
      items: [
        {icon: 'account-circle', title: '个人信息', subtitle: '管理您的个人资料'},
        {icon: 'security', title: '安全设置', subtitle: '密码、双重验证'},
        {icon: 'payment', title: '支付方式', subtitle: '银行卡、支付宝等'},
        {icon: 'history', title: '交易记录', subtitle: '查看历史交易'},
      ],
    },
    {
      section: '应用设置',
      items: [
        {icon: 'notifications', title: '通知设置', subtitle: '推送、提醒设置'},
        {icon: 'language', title: '语言设置', subtitle: '中文、English'},
        {icon: 'palette', title: '主题设置', subtitle: '深色、浅色模式'},
        {icon: 'data-usage', title: '数据使用', subtitle: '流量、存储管理'},
      ],
    },
    {
      section: '帮助支持',
      items: [
        {icon: 'help', title: '帮助中心', subtitle: '常见问题解答'},
        {icon: 'feedback', title: '意见反馈', subtitle: '提交建议和问题'},
        {icon: 'contact-support', title: '联系客服', subtitle: '7x24小时在线'},
        {icon: 'info', title: '关于我们', subtitle: '版本信息、隐私政策'},
      ],
    },
  ];

  const stats = [
    {label: '总资产', value: '¥128,456', color: '#FF6B35'},
    {label: '今日收益', value: '+¥2,345', color: '#4CAF50'},
    {label: '持仓数量', value: '12', color: '#2196F3'},
    {label: '交易次数', value: '156', color: '#9C27B0'},
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{uri: 'https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=P'}}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Icon name="camera-alt" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Potato用户</Text>
          <Text style={styles.userLevel}>VIP会员 · 等级 5</Text>
          <View style={styles.userStats}>
            <Text style={styles.userStatsText}>关注 128 · 粉丝 256</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Icon name="edit" size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={[styles.statValue, {color: stat.color}]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu Sections */}
      {menuItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.menuSection}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          <View style={styles.menuItems}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity key={itemIndex} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <Icon name={item.icon} size={24} color="#FF6B35" />
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="backup" size={24} color="#4CAF50" />
          <Text style={styles.quickActionText}>备份数据</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="share" size={24} color="#2196F3" />
          <Text style={styles.quickActionText}>分享应用</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="star" size={24} color="#FF9800" />
          <Text style={styles.quickActionText}>评价应用</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Icon name="logout" size={20} color="#F44336" />
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Potato Chat v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 Potato Chat Team</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userLevel: {
    fontSize: 14,
    color: '#FF6B35',
    marginTop: 5,
  },
  userStats: {
    marginTop: 5,
  },
  userStatsText: {
    fontSize: 12,
    color: '#666',
  },
  editProfileButton: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  menuSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  menuItems: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 20,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    marginLeft: 10,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
});

export default ProfileScreen;

