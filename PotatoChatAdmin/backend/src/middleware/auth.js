import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        error: '访问被拒绝，缺少认证令牌'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({
        error: '令牌无效，用户不存在'
      })
    }

    if (user.account.status !== 'active') {
      return res.status(403).json({
        error: '账户已被禁用'
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: '令牌无效'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: '令牌已过期'
      })
    }

    console.error('认证中间件错误:', error)
    res.status(500).json({
      error: '服务器内部错误'
    })
  }
}

export const adminMiddleware = (req, res, next) => {
  if (req.user.account.level !== 'admin') {
    return res.status(403).json({
      error: '需要管理员权限'
    })
  }
  next()
}

