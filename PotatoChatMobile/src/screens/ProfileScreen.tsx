import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);

  const menuItems = [
    {
      icon: 'account-circle',
      title: '个人信息',
      subtitle: '编辑个人资料',
      onPress: () => Alert.alert('提示', '个人信息编辑功能'),
    },
    {
      icon: 'security',
      title: '安全设置',
      subtitle: '密码、两步验证',
      onPress: () => Alert.alert('提示', '安全设置功能'),
    },
    {
      icon: 'account-balance-wallet',
      title: '我的钱包',
      subtitle: '资产管理',
      onPress: () => Alert.alert('提示', '钱包管理功能'),
    },
    {
      icon: 'history',
      title: '交易记录',
      subtitle: '查看历史交易',
      onPress: () => Alert.alert('提示', '交易记录功能'),
    },
    {
      icon: 'help',
      title: '帮助中心',
      subtitle: '常见问题',
      onPress: () => Alert.alert('提示', '帮助中心功能'),
    },
    {
      icon: 'info',
      title: '关于我们',
      subtitle: '版本信息',
      onPress: () => Alert.alert('关于', 'Potato Chat v1.0.0\n© 2025 Potato Chat Team'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      '确认退出',
      '您确定要退出登录吗？',
      [
        {text: '取消', style: 'cancel'},
        {text: '退出', style: 'destructive', onPress: () => {
          Alert.alert('提示', '已退出登录');
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息卡片 */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>P</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Potato用户</Text>
          <Text style={styles.userEmail}>potato@example.com</Text>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$3,334.75</Text>
              <Text style={styles.statLabel}>总资产</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>+2.1%</Text>
              <Text style={styles.statLabel}>24h收益</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit" size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* 快捷操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionItem}>
            <Icon name="qr-code" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>我的二维码</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <Icon name="share" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>邀请好友</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <Icon name="star" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>收藏</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <Icon name="download" size={24} color="#FF6B35" />
            <Text style={styles.quickActionText}>下载</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 设置选项 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设置</Text>
        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="notifications" size={24} color="#666" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>推送通知</Text>
                <Text style={styles.settingSubtitle}>接收重要消息提醒</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{false: '#ddd', true: '#FF6B35'}}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="fingerprint" size={24} color="#666" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>生物识别</Text>
                <Text style={styles.settingSubtitle}>指纹或面部识别登录</Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{false: '#ddd', true: '#FF6B35'}}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* 菜单列表 */}
      <View style={styles.section}>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <Icon name={item.icon} size={24} color="#666" />
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

      {/* 退出登录 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#F44336" />
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>

      {/* 版本信息 */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Potato Chat v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2025 Potato Chat Team</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  userCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  editButton: {
    padding: 8,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
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
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfileScreen;

