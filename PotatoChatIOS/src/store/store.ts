import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 用户状态接口
interface User {
  id: string
  username: string
  email: string
  avatar: string
  balance: number
  level: string
}

// 聊天消息接口
interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file'
}

// 聊天房间接口
interface ChatRoom {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  members: string[]
}

// 交易对接口
interface TradingPair {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  high24h: number
  low24h: number
}

// 应用状态接口
interface AppState {
  isAuthenticated: boolean
  user: User | null
  theme: 'light' | 'dark'
  language: 'zh' | 'en'
  notifications: boolean
}

// 聊天状态接口
interface ChatState {
  rooms: ChatRoom[]
  messages: { [roomId: string]: Message[] }
  activeRoom: string | null
  isLoading: boolean
}

// 交易状态接口
interface TradingState {
  pairs: TradingPair[]
  watchlist: string[]
  portfolio: { [symbol: string]: { amount: number; avgPrice: number } }
  isLoading: boolean
}

// 初始状态
const initialAppState: AppState = {
  isAuthenticated: false,
  user: null,
  theme: 'light',
  language: 'zh',
  notifications: true,
}

const initialChatState: ChatState = {
  rooms: [],
  messages: {},
  activeRoom: null,
  isLoading: false,
}

const initialTradingState: TradingState = {
  pairs: [],
  watchlist: [],
  portfolio: {},
  isLoading: false,
}

// App Slice
const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setLanguage: (state, action: PayloadAction<'zh' | 'en'>) => {
      state.language = action.payload
    },
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload
    },
  },
})

// Chat Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState: initialChatState,
  reducers: {
    setRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.rooms = action.payload
    },
    addRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.rooms.push(action.payload)
    },
    updateRoom: (state, action: PayloadAction<{ id: string; updates: Partial<ChatRoom> }>) => {
      const room = state.rooms.find(r => r.id === action.payload.id)
      if (room) {
        Object.assign(room, action.payload.updates)
      }
    },
    setMessages: (state, action: PayloadAction<{ roomId: string; messages: Message[] }>) => {
      state.messages[action.payload.roomId] = action.payload.messages
    },
    addMessage: (state, action: PayloadAction<{ roomId: string; message: Message }>) => {
      if (!state.messages[action.payload.roomId]) {
        state.messages[action.payload.roomId] = []
      }
      state.messages[action.payload.roomId].push(action.payload.message)
      
      // 更新房间的最后消息
      const room = state.rooms.find(r => r.id === action.payload.roomId)
      if (room) {
        room.lastMessage = action.payload.message.content
        room.lastMessageTime = action.payload.message.timestamp
        if (action.payload.roomId !== state.activeRoom) {
          room.unreadCount += 1
        }
      }
    },
    setActiveRoom: (state, action: PayloadAction<string | null>) => {
      state.activeRoom = action.payload
      // 清除未读计数
      if (action.payload) {
        const room = state.rooms.find(r => r.id === action.payload)
        if (room) {
          room.unreadCount = 0
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

// Trading Slice
const tradingSlice = createSlice({
  name: 'trading',
  initialState: initialTradingState,
  reducers: {
    setPairs: (state, action: PayloadAction<TradingPair[]>) => {
      state.pairs = action.payload
    },
    updatePair: (state, action: PayloadAction<TradingPair>) => {
      const index = state.pairs.findIndex(p => p.symbol === action.payload.symbol)
      if (index !== -1) {
        state.pairs[index] = action.payload
      } else {
        state.pairs.push(action.payload)
      }
    },
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload)
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(symbol => symbol !== action.payload)
    },
    updatePortfolio: (state, action: PayloadAction<{ symbol: string; amount: number; avgPrice: number }>) => {
      state.portfolio[action.payload.symbol] = {
        amount: action.payload.amount,
        avgPrice: action.payload.avgPrice,
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

// 持久化配置
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['app'], // 只持久化app状态
}

// 根reducer
const rootReducer = {
  app: persistReducer(persistConfig, appSlice.reducer),
  chat: chatSlice.reducer,
  trading: tradingSlice.reducer,
}

// 配置store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

// 导出actions
export const appActions = appSlice.actions
export const chatActions = chatSlice.actions
export const tradingActions = tradingSlice.actions

// 导出类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 导出选择器
export const selectUser = (state: RootState) => state.app.user
export const selectIsAuthenticated = (state: RootState) => state.app.isAuthenticated
export const selectTheme = (state: RootState) => state.app.theme
export const selectLanguage = (state: RootState) => state.app.language

export const selectChatRooms = (state: RootState) => state.chat.rooms
export const selectMessages = (roomId: string) => (state: RootState) => state.chat.messages[roomId] || []
export const selectActiveRoom = (state: RootState) => state.chat.activeRoom

export const selectTradingPairs = (state: RootState) => state.trading.pairs
export const selectWatchlist = (state: RootState) => state.trading.watchlist
export const selectPortfolio = (state: RootState) => state.trading.portfolio

