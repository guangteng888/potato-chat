const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// 导入数据库连接
const connectDB = require('./database/connection');

// 导入路由
const authRoutes = require('./routes/auth');
const apiManagementRoutes = require('./routes/api-management');
const tradingRecordsRoutes = require('./routes/trading-records');
const businessManagementRoutes = require('./routes/business-management');

// 导入中间件
const authMiddleware = require('./middleware/auth');

const app = express();

// 连接数据库
connectDB();

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// CORS配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 压缩中间件
app.use(compression());

// 请求日志
app.use(morgan('combined'));

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000, // 限制每个IP 15分钟内最多1000个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// 解析JSON和URL编码的请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API路由
app.use('/api/auth', authRoutes);

// 受保护的路由（需要认证）
app.use('/api/api-management', authMiddleware, apiManagementRoutes);
app.use('/api/trading-records', authMiddleware, tradingRecordsRoutes);
app.use('/api/business-management', authMiddleware, businessManagementRoutes);

// 用户管理路由（简化版，可以扩展）
app.use('/api/users', authMiddleware, (req, res) => {
  // 这里可以添加用户管理的具体路由
  res.json({ message: '用户管理API' });
});

// 静态文件服务（生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  
  // 处理React路由
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

// 404错误处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl,
    method: req.method
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose验证错误
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: '数据验证失败',
      details: errors
    });
  }

  // Mongoose重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: `${field} 已存在`
    });
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: '无效的访问令牌'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: '访问令牌已过期'
    });
  }

  // 默认服务器错误
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在优雅关闭...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在优雅关闭...');
  process.exit(0);
});

// 未捕获的异常处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Potato Chat 管理后台服务已启动
📍 端口: ${PORT}
🌍 环境: ${process.env.NODE_ENV || 'development'}
🕒 时间: ${new Date().toLocaleString()}
  `);
});

module.exports = app;

