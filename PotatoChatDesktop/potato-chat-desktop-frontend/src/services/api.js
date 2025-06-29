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

// 请求拦截器 - 添加认证token
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

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并跳转到登录页
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

// 认证相关API
export const authAPI = {
  // 登录
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    if (response.token) {
      localStorage.setItem('access_token', response.token)
      localStorage.setItem('user_info', JSON.stringify(response.user))
    }
    return response
  },

  // 注册
  register: async (userData) => {
    return await api.post('/auth/register', userData)
  },

  // 退出登录
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
    }
  },

  // 刷新token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    if (response.token) {
      localStorage.setItem('access_token', response.token)
    }
    return response
  },

  // 重置密码
  resetPassword: async (email) => {
    return await api.post('/auth/reset-password', { email })
  },

  // 验证token
  verifyToken: async () => {
    return await api.get('/auth/verify')
  },
}

// 用户相关API
export const userAPI = {
  // 获取用户信息
  getProfile: async (userId) => {
    return await api.get(`/users/${userId}`)
  },

  // 更新用户信息
  updateProfile: async (userId, profileData) => {
    return await api.put(`/users/${userId}`, profileData)
  },

  // 上传头像
  uploadAvatar: async (userId, file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return await api.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 获取用户列表
  getUsers: async (params = {}) => {
    return await api.get('/users', { params })
  },

  // 搜索用户
  searchUsers: async (query) => {
    return await api.get('/users/search', { params: { q: query } })
  },

  // 关注用户
  followUser: async (userId) => {
    return await api.post(`/users/${userId}/follow`)
  },

  // 取消关注
  unfollowUser: async (userId) => {
    return await api.delete(`/users/${userId}/follow`)
  },
}

// 聊天相关API
export const chatAPI = {
  // 获取聊天房间列表
  getRooms: async (userId) => {
    return await api.get(`/chat/rooms`, { params: { userId } })
  },

  // 创建聊天房间
  createRoom: async (roomData) => {
    return await api.post('/chat/rooms', roomData)
  },

  // 获取房间信息
  getRoom: async (roomId) => {
    return await api.get(`/chat/rooms/${roomId}`)
  },

  // 获取聊天消息
  getMessages: async (roomId, params = {}) => {
    return await api.get(`/chat/rooms/${roomId}/messages`, { params })
  },

  // 发送消息
  sendMessage: async (roomId, messageData) => {
    return await api.post(`/chat/rooms/${roomId}/messages`, messageData)
  },

  // 删除消息
  deleteMessage: async (roomId, messageId) => {
    return await api.delete(`/chat/rooms/${roomId}/messages/${messageId}`)
  },

  // 标记消息为已读
  markAsRead: async (roomId, messageId) => {
    return await api.put(`/chat/rooms/${roomId}/messages/${messageId}/read`)
  },

  // 上传文件
  uploadFile: async (roomId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return await api.post(`/chat/rooms/${roomId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 加入房间
  joinRoom: async (roomId) => {
    return await api.post(`/chat/rooms/${roomId}/join`)
  },

  // 离开房间
  leaveRoom: async (roomId) => {
    return await api.post(`/chat/rooms/${roomId}/leave`)
  },
}

// 交易相关API
export const tradingAPI = {
  // 获取交易对列表
  getTradingPairs: async () => {
    return await api.get('/trading/pairs')
  },

  // 获取市场数据
  getMarketData: async (symbol) => {
    return await api.get(`/trading/market/${symbol}`)
  },

  // 获取K线数据
  getKlineData: async (symbol, interval, limit = 100) => {
    return await api.get(`/trading/kline/${symbol}`, {
      params: { interval, limit }
    })
  },

  // 获取订单簿
  getOrderBook: async (symbol, limit = 20) => {
    return await api.get(`/trading/orderbook/${symbol}`, {
      params: { limit }
    })
  },

  // 获取最近交易
  getRecentTrades: async (symbol, limit = 50) => {
    return await api.get(`/trading/trades/${symbol}`, {
      params: { limit }
    })
  },

  // 下单
  placeOrder: async (orderData) => {
    return await api.post('/trading/orders', orderData)
  },

  // 取消订单
  cancelOrder: async (orderId) => {
    return await api.delete(`/trading/orders/${orderId}`)
  },

  // 获取用户订单
  getUserOrders: async (params = {}) => {
    return await api.get('/trading/orders', { params })
  },

  // 获取用户交易历史
  getTradeHistory: async (params = {}) => {
    return await api.get('/trading/history', { params })
  },

  // 获取用户资产
  getUserAssets: async () => {
    return await api.get('/trading/assets')
  },

  // 获取用户投资组合
  getPortfolio: async () => {
    return await api.get('/trading/portfolio')
  },

  // 充值
  deposit: async (depositData) => {
    return await api.post('/trading/deposit', depositData)
  },

  // 提现
  withdraw: async (withdrawData) => {
    return await api.post('/trading/withdraw', withdrawData)
  },
}

// 通知相关API
export const notificationAPI = {
  // 获取通知列表
  getNotifications: async (params = {}) => {
    return await api.get('/notifications', { params })
  },

  // 标记通知为已读
  markAsRead: async (notificationId) => {
    return await api.put(`/notifications/${notificationId}/read`)
  },

  // 标记所有通知为已读
  markAllAsRead: async () => {
    return await api.put('/notifications/read-all')
  },

  // 删除通知
  deleteNotification: async (notificationId) => {
    return await api.delete(`/notifications/${notificationId}`)
  },

  // 获取通知设置
  getSettings: async () => {
    return await api.get('/notifications/settings')
  },

  // 更新通知设置
  updateSettings: async (settings) => {
    return await api.put('/notifications/settings', settings)
  },
}

// 系统相关API
export const systemAPI = {
  // 获取系统状态
  getStatus: async () => {
    return await api.get('/system/status')
  },

  // 获取系统配置
  getConfig: async () => {
    return await api.get('/system/config')
  },

  // 获取公告
  getAnnouncements: async () => {
    return await api.get('/system/announcements')
  },

  // 反馈问题
  submitFeedback: async (feedbackData) => {
    return await api.post('/system/feedback', feedbackData)
  },

  // 获取帮助文档
  getHelp: async (category) => {
    return await api.get('/system/help', { params: { category } })
  },
}

// WebSocket连接管理
export class WebSocketManager {
  constructor() {
    this.ws = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.isConnecting = false
  }

  connect(token) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.isConnecting = true
    const wsUrl = `${WS_BASE_URL}?token=${token}`

    try {
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.emit('connected')
        this.startHeartbeat()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit('message', data)
          
          // 处理特定类型的消息
          if (data.type) {
            this.emit(data.type, data)
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        this.isConnecting = false
        this.stopHeartbeat()
        this.emit('disconnected', event)
        
        // 尝试重连
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(token)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
        this.emit('error', error)
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
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
    } else {
      console.warn('WebSocket not connected, message not sent:', data)
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
          console.error('Error in WebSocket event callback:', error)
        }
      })
    }
  }

  startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'ping', timestamp: Date.now() })
    }, 30000) // 30秒心跳
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  scheduleReconnect(token) {
    this.reconnectAttempts++
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}`)
    
    setTimeout(() => {
      this.connect(token)
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

// 创建WebSocket实例
export const wsManager = new WebSocketManager()

// 工具函数
export const utils = {
  // 格式化错误信息
  formatError: (error) => {
    if (typeof error === 'string') {
      return error
    }
    return error?.message || error?.error || '未知错误'
  },

  // 检查是否已登录
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    const userInfo = localStorage.getItem('user_info')
    return userInfo ? JSON.parse(userInfo) : null
  },

  // 格式化数字
  formatNumber: (num, decimals = 2) => {
    return Number(num).toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  },

  // 格式化货币
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  },

  // 格式化时间
  formatTime: (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  },

  // 计算百分比变化
  calculatePercentChange: (current, previous) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  },
}

export default api

