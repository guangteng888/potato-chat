import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

// 导入路由
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import chatRoutes from './routes/chat.js'
import tradingRoutes from './routes/trading.js'
import adminRoutes from './routes/admin.js'
import analyticsRoutes from './routes/analytics.js'

// 导入中间件
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'

// 导入服务
import { connectDatabase } from './database/connection.js'
import { initializeSocket } from './services/socketService.js'

// 加载环境变量
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// 基础中间件
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
})
app.use('/api/', limiter)

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API路由
app.use('/api/auth', authRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/chat', authMiddleware, chatRoutes)
app.use('/api/trading', authMiddleware, tradingRoutes)
app.use('/api/admin', authMiddleware, adminRoutes)
app.use('/api/analytics', authMiddleware, analyticsRoutes)

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API端点不存在',
    path: req.originalUrl
  })
})

// 错误处理中间件
app.use(errorHandler)

// 初始化Socket.IO
initializeSocket(io)

// 启动服务器
const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    // 连接数据库
    await connectDatabase()
    console.log('✅ 数据库连接成功')

    // 启动服务器
    server.listen(PORT, () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`)
      console.log(`📱 API地址: http://localhost:${PORT}/api`)
      console.log(`🔍 健康检查: http://localhost:${PORT}/health`)
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ 服务器启动失败:', error)
    process.exit(1)
  }
}

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭服务器...')
  server.close(() => {
    console.log('服务器已关闭')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在关闭服务器...')
  server.close(() => {
    console.log('服务器已关闭')
    process.exit(0)
  })
})

startServer()

export default app

