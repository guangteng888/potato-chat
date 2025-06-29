import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { sendEmail } from '../services/emailService.js'
import { generateTokens, verifyRefreshToken } from '../utils/tokenUtils.js'
import { validateInput } from '../utils/validation.js'

// 注册
export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body

    // 输入验证
    const validation = validateInput({
      username: { value: username, rules: ['required', 'minLength:3', 'maxLength:30'] },
      email: { value: email, rules: ['required', 'email'] },
      password: { value: password, rules: ['required', 'minLength:6'] },
      firstName: { value: firstName, rules: ['required', 'maxLength:50'] },
      lastName: { value: lastName, rules: ['required', 'maxLength:50'] }
    })

    if (!validation.isValid) {
      return res.status(400).json({
        error: '输入验证失败',
        details: validation.errors
      })
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username }
      ]
    })

    if (existingUser) {
      return res.status(409).json({
        error: existingUser.email === email.toLowerCase() ? '邮箱已被注册' : '用户名已被使用'
      })
    }

    // 创建新用户
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      profile: {
        firstName,
        lastName
      }
    })

    // 生成邮箱验证令牌
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')
    user.security.emailVerificationToken = emailVerificationToken
    user.security.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时

    await user.save()

    // 发送验证邮件
    try {
      await sendEmail({
        to: user.email,
        subject: '欢迎加入 Potato Chat - 请验证您的邮箱',
        template: 'emailVerification',
        data: {
          name: user.fullName,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
        }
      })
    } catch (emailError) {
      console.error('发送验证邮件失败:', emailError)
    }

    // 生成JWT令牌
    const { accessToken, refreshToken } = generateTokens(user._id)

    res.status(201).json({
      message: '注册成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.account.status,
        verified: user.account.verified
      },
      tokens: {
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      error: '注册失败，请稍后重试'
    })
  }
}

// 登录
export const login = async (req, res) => {
  try {
    const { login, password } = req.body // login可以是用户名或邮箱

    // 输入验证
    if (!login || !password) {
      return res.status(400).json({
        error: '请提供用户名/邮箱和密码'
      })
    }

    // 查找用户
    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login }
      ]
    })

    if (!user) {
      return res.status(401).json({
        error: '用户名或密码错误'
      })
    }

    // 检查账户是否被锁定
    if (user.isLocked) {
      return res.status(423).json({
        error: '账户已被锁定，请稍后重试'
      })
    }

    // 检查账户状态
    if (user.account.status === 'banned') {
      return res.status(403).json({
        error: '账户已被封禁'
      })
    }

    if (user.account.status === 'suspended') {
      return res.status(403).json({
        error: '账户已被暂停'
      })
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      await user.incrementLoginAttempts()
      return res.status(401).json({
        error: '用户名或密码错误'
      })
    }

    // 重置登录尝试次数
    if (user.security.loginAttempts > 0) {
      await user.resetLoginAttempts()
    }

    // 更新登录信息
    await user.updateLastLogin(req.ip, req.get('User-Agent'))

    // 生成JWT令牌
    const { accessToken, refreshToken } = generateTokens(user._id)

    res.json({
      message: '登录成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.account.status,
        level: user.account.level,
        verified: user.account.verified,
        lastLogin: user.activity.lastLogin
      },
      tokens: {
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      error: '登录失败，请稍后重试'
    })
  }
}

// 刷新令牌
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        error: '缺少刷新令牌'
      })
    }

    const decoded = verifyRefreshToken(refreshToken)
    const user = await User.findById(decoded.userId)

    if (!user || user.account.status !== 'active') {
      return res.status(401).json({
        error: '无效的刷新令牌'
      })
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id)

    res.json({
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    })
  } catch (error) {
    console.error('刷新令牌错误:', error)
    res.status(401).json({
      error: '刷新令牌失败'
    })
  }
}

// 邮箱验证
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        error: '缺少验证令牌'
      })
    }

    const user = await User.findOne({
      'security.emailVerificationToken': token,
      'security.emailVerificationExpires': { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        error: '验证令牌无效或已过期'
      })
    }

    user.account.verified.email = true
    user.security.emailVerificationToken = undefined
    user.security.emailVerificationExpires = undefined

    await user.save()

    res.json({
      message: '邮箱验证成功'
    })
  } catch (error) {
    console.error('邮箱验证错误:', error)
    res.status(500).json({
      error: '邮箱验证失败'
    })
  }
}

// 忘记密码
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        error: '请提供邮箱地址'
      })
    }

    const user = await User.findByEmail(email)
    if (!user) {
      // 为了安全，即使用户不存在也返回成功消息
      return res.json({
        message: '如果该邮箱已注册，您将收到密码重置邮件'
      })
    }

    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.security.passwordResetToken = resetToken
    user.security.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1小时

    await user.save()

    // 发送重置邮件
    try {
      await sendEmail({
        to: user.email,
        subject: 'Potato Chat - 密码重置请求',
        template: 'passwordReset',
        data: {
          name: user.fullName,
          resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        }
      })
    } catch (emailError) {
      console.error('发送重置邮件失败:', emailError)
    }

    res.json({
      message: '如果该邮箱已注册，您将收到密码重置邮件'
    })
  } catch (error) {
    console.error('忘记密码错误:', error)
    res.status(500).json({
      error: '处理请求失败'
    })
  }
}

// 重置密码
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        error: '缺少必要参数'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: '密码长度至少6位'
      })
    }

    const user = await User.findOne({
      'security.passwordResetToken': token,
      'security.passwordResetExpires': { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        error: '重置令牌无效或已过期'
      })
    }

    user.password = password
    user.security.passwordResetToken = undefined
    user.security.passwordResetExpires = undefined
    user.security.loginAttempts = 0
    user.security.lockUntil = undefined

    await user.save()

    res.json({
      message: '密码重置成功'
    })
  } catch (error) {
    console.error('重置密码错误:', error)
    res.status(500).json({
      error: '密码重置失败'
    })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    // 在实际应用中，这里可以将令牌加入黑名单
    // 或者在Redis中记录已登出的令牌
    
    res.json({
      message: '登出成功'
    })
  } catch (error) {
    console.error('登出错误:', error)
    res.status(500).json({
      error: '登出失败'
    })
  }
}

// 获取当前用户信息
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        error: '用户不存在'
      })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        account: user.account,
        preferences: user.preferences,
        activity: {
          lastLogin: user.activity.lastLogin,
          lastActive: user.activity.lastActive,
          loginCount: user.activity.loginCount
        }
      }
    })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({
      error: '获取用户信息失败'
    })
  }
}

