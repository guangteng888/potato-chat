import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    phone: {
      type: String,
      match: /^[+]?[\d\s-()]+$/,
      default: ''
    },
    dateOfBirth: {
      type: Date
    },
    location: {
      country: String,
      city: String
    }
  },
  account: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'banned'],
      default: 'active'
    },
    level: {
      type: String,
      enum: ['basic', 'premium', 'vip', 'enterprise'],
      default: 'basic'
    },
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    verified: {
      email: {
        type: Boolean,
        default: false
      },
      phone: {
        type: Boolean,
        default: false
      },
      identity: {
        type: Boolean,
        default: false
      }
    }
  },
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: String,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date
  },
  activity: {
    lastLogin: Date,
    lastActive: Date,
    loginCount: {
      type: Number,
      default: 0
    },
    ipAddresses: [{
      ip: String,
      timestamp: Date,
      userAgent: String
    }]
  },
  preferences: {
    language: {
      type: String,
      default: 'zh-CN'
    },
    timezone: {
      type: String,
      default: 'Asia/Shanghai'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisible: {
        type: Boolean,
        default: true
      },
      showOnlineStatus: {
        type: Boolean,
        default: true
      }
    }
  },
  trading: {
    totalTrades: {
      type: Number,
      default: 0
    },
    totalVolume: {
      type: Number,
      default: 0
    },
    profitLoss: {
      type: Number,
      default: 0
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  social: {
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    blockedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.security.twoFactorSecret
      delete ret.security.passwordResetToken
      delete ret.security.emailVerificationToken
      return ret
    }
  }
})

// 索引
userSchema.index({ username: 1 })
userSchema.index({ email: 1 })
userSchema.index({ 'account.status': 1 })
userSchema.index({ 'activity.lastLogin': -1 })
userSchema.index({ createdAt: -1 })

// 虚拟字段
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`
})

userSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now())
})

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// 实例方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.incrementLoginAttempts = function() {
  // 如果之前有锁定且已过期，重置计数器
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'security.lockUntil': 1 },
      $set: { 'security.loginAttempts': 1 }
    })
  }
  
  const updates = { $inc: { 'security.loginAttempts': 1 } }
  
  // 如果达到最大尝试次数且未锁定，则锁定账户
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { 'security.lockUntil': Date.now() + 2 * 60 * 60 * 1000 } // 锁定2小时
  }
  
  return this.updateOne(updates)
}

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      'security.loginAttempts': 1,
      'security.lockUntil': 1
    }
  })
}

userSchema.methods.updateLastLogin = function(ip, userAgent) {
  const updates = {
    'activity.lastLogin': new Date(),
    'activity.lastActive': new Date(),
    $inc: { 'activity.loginCount': 1 }
  }
  
  if (ip) {
    updates.$push = {
      'activity.ipAddresses': {
        $each: [{
          ip,
          timestamp: new Date(),
          userAgent
        }],
        $slice: -10 // 只保留最近10次登录记录
      }
    }
  }
  
  return this.updateOne(updates)
}

// 静态方法
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username })
}

userSchema.statics.getActiveUsers = function() {
  return this.find({ 'account.status': 'active' })
}

userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$account.status',
        count: { $sum: 1 }
      }
    }
  ])
  
  const totalUsers = await this.countDocuments()
  const activeUsers = await this.countDocuments({ 'account.status': 'active' })
  const newUsersToday = await this.countDocuments({
    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
  })
  
  return {
    total: totalUsers,
    active: activeUsers,
    newToday: newUsersToday,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count
      return acc
    }, {})
  }
}

const User = mongoose.model('User', userSchema)

export default User

