import axios from 'axios'

// API基础配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.potatochat.com/v1'
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'wss://ws.potatochat.com/v1'

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

// 认证API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    if (response.token) {
      localStorage.setItem('access_token', response.token)
      localStorage.setItem('user_info', JSON.stringify(response.user))
    }
    return response
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData)
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
    }
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    if (response.token) {
      localStorage.setItem('access_token', response.token)
    }
    return response
  },
}

// 用户API
export const userAPI = {
  getProfile: async (userId) => {
    return await api.get(`/users/${userId}`)
  },

  updateProfile: async (userId, profileData) => {
    return await api.put(`/users/${userId}`, profileData)
  },

  uploadAvatar: async (userId, file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return await api.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getUsers: async (params = {}) => {
    return await api.get('/users', { params })
  },

  searchUsers: async (query) => {
    return await api.get('/users/search', { params: { q: query } })
  },
}

// 聊天API
export const chatAPI = {
  getRooms: async (userId) => {
    return await api.get(`/chat/rooms`, { params: { userId } })
  },

  createRoom: async (roomData) => {
    return await api.post('/chat/rooms', roomData)
  },

  getRoom: async (roomId) => {
    return await api.get(`/chat/rooms/${roomId}`)
  },

  getMessages: async (roomId, params = {}) => {
    return await api.get(`/chat/rooms/${roomId}/messages`, { params })
  },

  sendMessage: async (roomId, messageData) => {
    return await api.post(`/chat/rooms/${roomId}/messages`, messageData)
  },

  deleteMessage: async (roomId, messageId) => {
    return await api.delete(`/chat/rooms/${roomId}/messages/${messageId}`)
  },

  markAsRead: async (roomId, messageId) => {
    return await api.put(`/chat/rooms/${roomId}/messages/${messageId}/read`)
  },

  uploadFile: async (roomId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return await api.post(`/chat/rooms/${roomId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// 交易API
export const tradingAPI = {
  getTradingPairs: async () => {
    return await api.get('/trading/pairs')
  },

  getMarketData: async (symbol) => {
    return await api.get(`/trading/market/${symbol}`)
  },

  getKlineData: async (symbol, interval, limit = 100) => {
    return await api.get(`/trading/kline/${symbol}`, {
      params: { interval, limit }
    })
  },

  getOrderBook: async (symbol, limit = 20) => {
    return await api.get(`/trading/orderbook/${symbol}`, {
      params: { limit }
    })
  },

  placeOrder: async (orderData) => {
    return await api.post('/trading/orders', orderData)
  },

  cancelOrder: async (orderId) => {
    return await api.delete(`/trading/orders/${orderId}`)
  },

  getUserOrders: async (params = {}) => {
    return await api.get('/trading/orders', { params })
  },

  getTradeHistory: async (params = {}) => {
    return await api.get('/trading/history', { params })
  },

  getUserAssets: async () => {
    return await api.get('/trading/assets')
  },

  getPortfolio: async () => {
    return await api.get('/trading/portfolio')
  },
}

// WebSocket管理器 (移动端优化版本)
export class MobileWebSocketManager {
  constructor() {
    this.ws = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 3 // 移动端减少重连次数
    this.reconnectDelay = 5000 // 移动端增加重连延迟
    this.isConnecting = false
    this.isVisible = true
    
    // 监听页面可见性变化
    this.handleVisibilityChange()
  }

  connect(token) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    // 页面不可见时不连接
    if (!this.isVisible) {
      return
    }

    this.isConnecting = true
    const wsUrl = `${WS_BASE_URL}?token=${token}`

    try {
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('Mobile WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.emit('connected')
        this.startHeartbeat()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit('message', data)
          
          if (data.type) {
            this.emit(data.type, data)
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('Mobile WebSocket closed:', event.code, event.reason)
        this.isConnecting = false
        this.stopHeartbeat()
        this.emit('disconnected', event)
        
        // 只在页面可见时重连
        if (this.isVisible && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(token)
        }
      }

      this.ws.onerror = (error) => {
        console.error('Mobile WebSocket error:', error)
        this.isConnecting = false
        this.emit('error', error)
      }

    } catch (error) {
      console.error('Failed to create mobile WebSocket connection:', error)
      this.isConnecting = false
      this.emit('error', error)
    }
  }

  disconnect() {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in mobile WebSocket event callback:', error)
        }
      })
    }
  }

  startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatInterval = setInterval(() => {
      if (this.isVisible) {
        this.send({ type: 'ping', timestamp: Date.now() })
      }
    }, 45000) // 移动端延长心跳间隔
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  scheduleReconnect(token) {
    this.reconnectAttempts++
    console.log(`Scheduling mobile reconnect attempt ${this.reconnectAttempts}`)
    
    setTimeout(() => {
      if (this.isVisible) {
        this.connect(token)
      }
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  handleVisibilityChange() {
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden
      
      if (this.isVisible) {
        // 页面变为可见时，如果连接断开则尝试重连
        if (!this.isConnected()) {
          const token = localStorage.getItem('access_token')
          if (token) {
            this.connect(token)
          }
        }
      } else {
        // 页面不可见时断开连接以节省资源
        this.disconnect()
      }
    })

    // 监听网络状态变化
    window.addEventListener('online', () => {
      console.log('Network online, attempting to reconnect')
      if (this.isVisible) {
        const token = localStorage.getItem('access_token')
        if (token) {
          this.connect(token)
        }
      }
    })

    window.addEventListener('offline', () => {
      console.log('Network offline, disconnecting WebSocket')
      this.disconnect()
    })
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

// 创建移动端WebSocket实例
export const mobileWsManager = new MobileWebSocketManager()

// 移动端优化的工具函数
export const mobileUtils = {
  // 检测是否为移动设备
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  // 检测是否为触摸设备
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },

  // 获取设备信息
  getDeviceInfo: () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    }
  },

  // 防抖函数
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // 节流函数
  throttle: (func, limit) => {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // 格式化文件大小
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // 检查网络状态
  checkNetworkStatus: () => {
    return {
      online: navigator.onLine,
      connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
    }
  },

  // 本地存储管理
  storage: {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
        return false
      }
    },

    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch (error) {
        console.error('Failed to read from localStorage:', error)
        return defaultValue
      }
    },

    remove: (key) => {
      try {
        localStorage.removeItem(key)
        return true
      } catch (error) {
        console.error('Failed to remove from localStorage:', error)
        return false
      }
    },

    clear: () => {
      try {
        localStorage.clear()
        return true
      } catch (error) {
        console.error('Failed to clear localStorage:', error)
        return false
      }
    },
  },

  // 通用工具函数
  formatError: (error) => {
    if (typeof error === 'string') return error
    return error?.message || error?.error || '未知错误'
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  },

  getCurrentUser: () => {
    const userInfo = localStorage.getItem('user_info')
    return userInfo ? JSON.parse(userInfo) : null
  },

  formatNumber: (num, decimals = 2) => {
    return Number(num).toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  },

  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  },

  formatTime: (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return '刚刚'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}小时前`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  },

  calculatePercentChange: (current, previous) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  },
}

export default api

