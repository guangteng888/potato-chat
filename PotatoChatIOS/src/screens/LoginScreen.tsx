import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native'
import { useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { appActions } from '../store/store'

interface LoginScreenProps {
  navigation: any
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const dispatch = useDispatch()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert('错误', '请输入用户名')
      return false
    }
    
    if (!isLogin && !formData.email.trim()) {
      Alert.alert('错误', '请输入邮箱')
      return false
    }
    
    if (!formData.password.trim()) {
      Alert.alert('错误', '请输入密码')
      return false
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      Alert.alert('错误', '两次输入的密码不一致')
      return false
    }
    
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟登录成功
      const mockUser = {
        id: '1',
        username: formData.username,
        email: formData.email || 'user@example.com',
        avatar: '🥔',
        balance: 12500.50,
        level: 'VIP',
      }
      
      dispatch(appActions.login(mockUser))
      navigation.replace('Main')
      
    } catch (error) {
      Alert.alert('错误', isLogin ? '登录失败' : '注册失败')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo区域 */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🥔</Text>
          <Text style={styles.title}>Potato Chat</Text>
          <Text style={styles.subtitle}>社交金融新体验</Text>
        </View>

        {/* 表单区域 */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? '欢迎回来' : '创建账户'}
          </Text>
          
          {/* 用户名输入 */}
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="用户名"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* 邮箱输入 (仅注册时显示) */}
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="邮箱地址"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {/* 密码输入 */}
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="密码"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#8E8E93" 
              />
            </TouchableOpacity>
          </View>

          {/* 确认密码输入 (仅注册时显示) */}
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="确认密码"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {/* 忘记密码链接 (仅登录时显示) */}
          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>忘记密码？</Text>
            </TouchableOpacity>
          )}

          {/* 提交按钮 */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </Text>
          </TouchableOpacity>

          {/* 切换模式 */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin ? '还没有账户？' : '已有账户？'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.switchLink}>
                {isLogin ? '立即注册' : '立即登录'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 社交登录 */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>或使用以下方式登录</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="logo-apple" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="logo-google" size={24} color="#4285F4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  formContainer: {
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF6B35',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  switchLink: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialTitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
})

export default LoginScreen

