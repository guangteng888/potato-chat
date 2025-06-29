import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { appActions, selectUser, selectTheme, selectLanguage } from '../store/store'

interface SettingsScreenProps {
  navigation: any
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const theme = useSelector(selectTheme)
  const language = useSelector(selectLanguage)
  
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [autoLock, setAutoLock] = useState(true)

  const handleLogout = () => {
    Alert.alert(
      '确认退出',
      '您确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '退出', 
          style: 'destructive',
          onPress: () => {
            dispatch(appActions.logout())
            navigation.replace('Login')
          }
        },
      ]
    )
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      '删除账户',
      '此操作不可撤销，您的所有数据将被永久删除。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '删除', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('账户已删除', '您的账户已被成功删除')
            dispatch(appActions.logout())
            navigation.replace('Login')
          }
        },
      ]
    )
  }

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    showArrow = true,
    danger = false 
  }: {
    icon: string
    title: string
    subtitle?: string
    onPress?: () => void
    rightElement?: React.ReactNode
    showArrow?: boolean
    danger?: boolean
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, danger && styles.dangerIconContainer]}>
          <Icon 
            name={icon} 
            size={20} 
            color={danger ? "#FF3B30" : "#FF6B35"} 
          />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showArrow && !rightElement && (
          <Icon name="chevron-forward" size={20} color="#8E8E93" />
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息 */}
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar || '🥔'}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.username || '用户'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.userLevel}>
              <Text style={styles.levelText}>{user?.level || 'VIP'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>编辑资料</Text>
        </TouchableOpacity>
      </View>

      {/* 账户设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账户设置</Text>
        
        <SettingItem
          icon="person-outline"
          title="个人信息"
          subtitle="管理您的个人资料"
          onPress={() => console.log('个人信息')}
        />
        
        <SettingItem
          icon="card-outline"
          title="支付方式"
          subtitle="管理支付方式和银行卡"
          onPress={() => console.log('支付方式')}
        />
        
        <SettingItem
          icon="shield-checkmark-outline"
          title="安全设置"
          subtitle="密码、双重验证"
          onPress={() => console.log('安全设置')}
        />
        
        <SettingItem
          icon="wallet-outline"
          title="钱包管理"
          subtitle={`余额: $${user?.balance?.toFixed(2) || '0.00'}`}
          onPress={() => console.log('钱包管理')}
        />
      </View>

      {/* 应用设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>应用设置</Text>
        
        <SettingItem
          icon="notifications-outline"
          title="推送通知"
          subtitle="管理通知偏好"
          rightElement={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E5EA', true: '#FF6B35' }}
              thumbColor="#FFFFFF"
            />
          }
          showArrow={false}
        />
        
        <SettingItem
          icon="color-palette-outline"
          title="主题"
          subtitle={theme === 'light' ? '浅色模式' : '深色模式'}
          onPress={() => {
            dispatch(appActions.setTheme(theme === 'light' ? 'dark' : 'light'))
          }}
        />
        
        <SettingItem
          icon="language-outline"
          title="语言"
          subtitle={language === 'zh' ? '中文' : 'English'}
          onPress={() => {
            dispatch(appActions.setLanguage(language === 'zh' ? 'en' : 'zh'))
          }}
        />
        
        <SettingItem
          icon="finger-print-outline"
          title="生物识别"
          subtitle="使用指纹或面容ID登录"
          rightElement={
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: '#E5E5EA', true: '#FF6B35' }}
              thumbColor="#FFFFFF"
            />
          }
          showArrow={false}
        />
        
        <SettingItem
          icon="lock-closed-outline"
          title="自动锁定"
          subtitle="应用进入后台时自动锁定"
          rightElement={
            <Switch
              value={autoLock}
              onValueChange={setAutoLock}
              trackColor={{ false: '#E5E5EA', true: '#FF6B35' }}
              thumbColor="#FFFFFF"
            />
          }
          showArrow={false}
        />
      </View>

      {/* 交易设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>交易设置</Text>
        
        <SettingItem
          icon="trending-up-outline"
          title="交易偏好"
          subtitle="风险等级、默认设置"
          onPress={() => console.log('交易偏好')}
        />
        
        <SettingItem
          icon="analytics-outline"
          title="价格提醒"
          subtitle="设置价格变动通知"
          onPress={() => console.log('价格提醒')}
        />
        
        <SettingItem
          icon="time-outline"
          title="交易历史"
          subtitle="查看所有交易记录"
          onPress={() => console.log('交易历史')}
        />
      </View>

      {/* 帮助与支持 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>帮助与支持</Text>
        
        <SettingItem
          icon="help-circle-outline"
          title="帮助中心"
          subtitle="常见问题和使用指南"
          onPress={() => console.log('帮助中心')}
        />
        
        <SettingItem
          icon="chatbubble-outline"
          title="联系客服"
          subtitle="在线客服支持"
          onPress={() => console.log('联系客服')}
        />
        
        <SettingItem
          icon="document-text-outline"
          title="用户协议"
          subtitle="服务条款和隐私政策"
          onPress={() => console.log('用户协议')}
        />
        
        <SettingItem
          icon="star-outline"
          title="评价应用"
          subtitle="在App Store中评价"
          onPress={() => console.log('评价应用')}
        />
      </View>

      {/* 危险操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账户操作</Text>
        
        <SettingItem
          icon="log-out-outline"
          title="退出登录"
          onPress={handleLogout}
          showArrow={false}
          danger
        />
        
        <SettingItem
          icon="trash-outline"
          title="删除账户"
          subtitle="永久删除您的账户和所有数据"
          onPress={handleDeleteAccount}
          showArrow={false}
          danger
        />
      </View>

      {/* 版本信息 */}
      <View style={styles.versionSection}>
        <Text style={styles.versionText}>Potato Chat v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2024 Potato Chat Team</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  userSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  userLevel: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF4F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dangerIconContainer: {
    backgroundColor: '#FFEBEA',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  dangerText: {
    color: '#FF3B30',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#8E8E93',
  },
})

export default SettingsScreen

