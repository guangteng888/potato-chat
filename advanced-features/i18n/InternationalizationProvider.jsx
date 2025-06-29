import React, { createContext, useContext, useState, useEffect } from 'react'

// 语言配置
const SUPPORTED_LANGUAGES = {
  'zh-CN': {
    name: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr',
    currency: 'CNY',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'zh-CN'
  },
  'zh-TW': {
    name: '繁體中文',
    flag: '🇹🇼',
    direction: 'ltr',
    currency: 'TWD',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'zh-TW'
  },
  'en-US': {
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US'
  },
  'ja-JP': {
    name: '日本語',
    flag: '🇯🇵',
    direction: 'ltr',
    currency: 'JPY',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: 'ja-JP'
  },
  'ko-KR': {
    name: '한국어',
    flag: '🇰🇷',
    direction: 'ltr',
    currency: 'KRW',
    dateFormat: 'YYYY.MM.DD',
    numberFormat: 'ko-KR'
  },
  'es-ES': {
    name: 'Español',
    flag: '🇪🇸',
    direction: 'ltr',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'es-ES'
  },
  'fr-FR': {
    name: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-FR'
  },
  'de-DE': {
    name: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr',
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: 'de-DE'
  },
  'ar-SA': {
    name: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
    currency: 'SAR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'ar-SA'
  },
  'hi-IN': {
    name: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'hi-IN'
  }
}

// 翻译文本
const TRANSLATIONS = {
  'zh-CN': {
    // 通用
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.refresh': '刷新',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.submit': '提交',
    'common.reset': '重置',
    
    // 导航
    'nav.home': '首页',
    'nav.chat': '聊天',
    'nav.trading': '交易',
    'nav.profile': '个人中心',
    'nav.settings': '设置',
    'nav.help': '帮助',
    'nav.logout': '退出登录',
    
    // 认证
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.forgotPassword': '忘记密码？',
    'auth.rememberMe': '记住我',
    'auth.loginSuccess': '登录成功',
    'auth.loginFailed': '登录失败',
    'auth.registerSuccess': '注册成功',
    'auth.registerFailed': '注册失败',
    
    // 聊天
    'chat.sendMessage': '发送消息',
    'chat.typing': '正在输入...',
    'chat.online': '在线',
    'chat.offline': '离线',
    'chat.lastSeen': '最后在线',
    'chat.newMessage': '新消息',
    'chat.voiceMessage': '语音消息',
    'chat.imageMessage': '图片消息',
    'chat.fileMessage': '文件消息',
    
    // 交易
    'trading.buy': '买入',
    'trading.sell': '卖出',
    'trading.price': '价格',
    'trading.amount': '数量',
    'trading.total': '总计',
    'trading.balance': '余额',
    'trading.available': '可用',
    'trading.orderHistory': '订单历史',
    'trading.marketPrice': '市价',
    'trading.limitPrice': '限价',
    'trading.stopLoss': '止损',
    'trading.takeProfit': '止盈',
    
    // 设置
    'settings.language': '语言',
    'settings.currency': '货币',
    'settings.timezone': '时区',
    'settings.notifications': '通知',
    'settings.privacy': '隐私',
    'settings.security': '安全',
    'settings.theme': '主题',
    'settings.darkMode': '深色模式',
    'settings.lightMode': '浅色模式',
    
    // 错误消息
    'error.networkError': '网络连接错误',
    'error.serverError': '服务器错误',
    'error.invalidInput': '输入无效',
    'error.unauthorized': '未授权访问',
    'error.forbidden': '访问被禁止',
    'error.notFound': '页面未找到',
    'error.timeout': '请求超时',
    
    // 成功消息
    'success.saved': '保存成功',
    'success.updated': '更新成功',
    'success.deleted': '删除成功',
    'success.sent': '发送成功',
    'success.uploaded': '上传成功'
  },
  
  'en-US': {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    
    // Navigation
    'nav.home': 'Home',
    'nav.chat': 'Chat',
    'nav.trading': 'Trading',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.help': 'Help',
    'nav.logout': 'Logout',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.loginSuccess': 'Login Successful',
    'auth.loginFailed': 'Login Failed',
    'auth.registerSuccess': 'Registration Successful',
    'auth.registerFailed': 'Registration Failed',
    
    // Chat
    'chat.sendMessage': 'Send Message',
    'chat.typing': 'Typing...',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.lastSeen': 'Last Seen',
    'chat.newMessage': 'New Message',
    'chat.voiceMessage': 'Voice Message',
    'chat.imageMessage': 'Image Message',
    'chat.fileMessage': 'File Message',
    
    // Trading
    'trading.buy': 'Buy',
    'trading.sell': 'Sell',
    'trading.price': 'Price',
    'trading.amount': 'Amount',
    'trading.total': 'Total',
    'trading.balance': 'Balance',
    'trading.available': 'Available',
    'trading.orderHistory': 'Order History',
    'trading.marketPrice': 'Market Price',
    'trading.limitPrice': 'Limit Price',
    'trading.stopLoss': 'Stop Loss',
    'trading.takeProfit': 'Take Profit',
    
    // Settings
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    'settings.timezone': 'Timezone',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.security': 'Security',
    'settings.theme': 'Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    
    // Error Messages
    'error.networkError': 'Network Connection Error',
    'error.serverError': 'Server Error',
    'error.invalidInput': 'Invalid Input',
    'error.unauthorized': 'Unauthorized Access',
    'error.forbidden': 'Access Forbidden',
    'error.notFound': 'Page Not Found',
    'error.timeout': 'Request Timeout',
    
    // Success Messages
    'success.saved': 'Saved Successfully',
    'success.updated': 'Updated Successfully',
    'success.deleted': 'Deleted Successfully',
    'success.sent': 'Sent Successfully',
    'success.uploaded': 'Uploaded Successfully'
  }
  
  // 其他语言的翻译可以类似添加...
}

// 国际化上下文
const I18nContext = createContext()

// 国际化提供者组件
export const InternationalizationProvider = ({ children, defaultLanguage = 'zh-CN' }) => {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage)
  const [translations, setTranslations] = useState(TRANSLATIONS[defaultLanguage] || {})
  const [isLoading, setIsLoading] = useState(false)

  // 检测浏览器语言
  useEffect(() => {
    const browserLanguage = navigator.language || navigator.languages[0]
    const supportedLanguage = Object.keys(SUPPORTED_LANGUAGES).find(
      lang => lang.startsWith(browserLanguage.split('-')[0])
    )
    
    if (supportedLanguage && supportedLanguage !== defaultLanguage) {
      changeLanguage(supportedLanguage)
    }
  }, [])

  // 更改语言
  const changeLanguage = async (languageCode) => {
    if (!SUPPORTED_LANGUAGES[languageCode]) {
      console.error(`不支持的语言: ${languageCode}`)
      return
    }

    setIsLoading(true)
    
    try {
      // 如果翻译已缓存，直接使用
      if (TRANSLATIONS[languageCode]) {
        setTranslations(TRANSLATIONS[languageCode])
        setCurrentLanguage(languageCode)
      } else {
        // 动态加载翻译文件
        const response = await fetch(`/locales/${languageCode}.json`)
        const newTranslations = await response.json()
        
        TRANSLATIONS[languageCode] = newTranslations
        setTranslations(newTranslations)
        setCurrentLanguage(languageCode)
      }
      
      // 更新HTML属性
      document.documentElement.lang = languageCode
      document.documentElement.dir = SUPPORTED_LANGUAGES[languageCode].direction
      
      // 保存到本地存储
      localStorage.setItem('preferred-language', languageCode)
      
    } catch (error) {
      console.error('加载语言文件失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 翻译函数
  const t = (key, params = {}) => {
    let translation = translations[key] || key
    
    // 参数替换
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param])
    })
    
    return translation
  }

  // 格式化数字
  const formatNumber = (number, options = {}) => {
    const locale = SUPPORTED_LANGUAGES[currentLanguage].numberFormat
    return new Intl.NumberFormat(locale, options).format(number)
  }

  // 格式化货币
  const formatCurrency = (amount, currency = null) => {
    const locale = SUPPORTED_LANGUAGES[currentLanguage].numberFormat
    const currencyCode = currency || SUPPORTED_LANGUAGES[currentLanguage].currency
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode
    }).format(amount)
  }

  // 格式化日期
  const formatDate = (date, options = {}) => {
    const locale = SUPPORTED_LANGUAGES[currentLanguage].numberFormat
    return new Intl.DateTimeFormat(locale, options).format(new Date(date))
  }

  // 格式化相对时间
  const formatRelativeTime = (date) => {
    const locale = SUPPORTED_LANGUAGES[currentLanguage].numberFormat
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    
    const now = new Date()
    const targetDate = new Date(date)
    const diffInSeconds = Math.floor((targetDate - now) / 1000)
    
    const intervals = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 }
    ]
    
    for (const interval of intervals) {
      const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
      if (count >= 1) {
        return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit)
      }
    }
    
    return rtf.format(0, 'second')
  }

  // 获取当前语言信息
  const getCurrentLanguageInfo = () => SUPPORTED_LANGUAGES[currentLanguage]

  // 获取支持的语言列表
  const getSupportedLanguages = () => SUPPORTED_LANGUAGES

  // 检查是否为RTL语言
  const isRTL = () => SUPPORTED_LANGUAGES[currentLanguage].direction === 'rtl'

  const value = {
    currentLanguage,
    translations,
    isLoading,
    changeLanguage,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    getCurrentLanguageInfo,
    getSupportedLanguages,
    isRTL
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

// 使用国际化的Hook
export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an InternationalizationProvider')
  }
  return context
}

// 语言选择器组件
export const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, getSupportedLanguages, isLoading } = useI18n()
  const supportedLanguages = getSupportedLanguages()

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
      disabled={isLoading}
      className={`language-selector ${className}`}
    >
      {Object.entries(supportedLanguages).map(([code, info]) => (
        <option key={code} value={code}>
          {info.flag} {info.name}
        </option>
      ))}
    </select>
  )
}

// 翻译组件
export const Trans = ({ i18nKey, params = {}, children }) => {
  const { t } = useI18n()
  
  if (children) {
    return children
  }
  
  return t(i18nKey, params)
}

// 高阶组件：为组件添加国际化支持
export const withI18n = (Component) => {
  return function I18nComponent(props) {
    const i18n = useI18n()
    return <Component {...props} i18n={i18n} />
  }
}

export default InternationalizationProvider

