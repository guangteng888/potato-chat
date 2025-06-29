import express from 'express'
import rateLimit from 'express-rate-limit'
import {
  register,
  login,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  getCurrentUser
} from '../controllers/authController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// 认证相关的速率限制
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制每个IP 15分钟内最多5次认证请求
  message: {
    error: '认证请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
})

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 3, // 限制每个IP 1小时内最多3次密码重置请求
  message: {
    error: '密码重置请求过于频繁，请稍后再试'
  }
})

// 公开路由
router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/refresh-token', refreshToken)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', passwordResetLimiter, forgotPassword)
router.post('/reset-password', passwordResetLimiter, resetPassword)

// 需要认证的路由
router.post('/logout', authMiddleware, logout)
router.get('/me', authMiddleware, getCurrentUser)

export default router

