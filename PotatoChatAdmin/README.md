# 🥔 Potato Chat 管理后台系统

## 📖 项目概述

Potato Chat 管理后台是一个现代化的全栈管理系统，为 Potato Chat 社交金融平台提供完整的运营管理功能。

### ✨ 核心功能

- 🏠 **仪表板** - 实时数据监控和系统状态概览
- 👥 **用户管理** - 用户账户管理、权限控制、状态监控
- 💬 **内容管理** - 聊天内容审核、消息管理、违规处理
- 📈 **交易管理** - 交易监控、风险控制、资金管理
- 📊 **数据分析** - 用户行为分析、业务数据统计
- ⚙️ **系统设置** - 平台配置、功能开关、参数管理

## 🏗️ 技术架构

### 前端技术栈
- **React 18** - 现代化用户界面框架
- **React Router** - 单页应用路由管理
- **TanStack Query** - 服务端状态管理
- **Tailwind CSS** - 实用优先的CSS框架
- **Recharts** - 数据可视化图表库
- **Lucide React** - 现代化图标库
- **React Hook Form** - 高性能表单处理
- **Zod** - TypeScript优先的模式验证

### 后端技术栈
- **Node.js** - JavaScript运行时环境
- **Express.js** - Web应用框架
- **MongoDB** - NoSQL文档数据库
- **Mongoose** - MongoDB对象建模工具
- **Socket.IO** - 实时双向通信
- **Redis** - 内存数据结构存储
- **JWT** - JSON Web Token认证
- **bcryptjs** - 密码加密
- **Nodemailer** - 邮件发送服务

## 📁 项目结构

```
PotatoChatAdmin/
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/         # 可复用组件
│   │   ├── pages/             # 页面组件
│   │   ├── hooks/             # 自定义Hook
│   │   ├── services/          # API服务
│   │   ├── utils/             # 工具函数
│   │   └── store/             # 状态管理
│   ├── package.json           # 前端依赖配置
│   └── vite.config.js         # Vite构建配置
│
├── backend/                    # 后端API服务
│   ├── src/
│   │   ├── controllers/       # 控制器
│   │   ├── models/            # 数据模型
│   │   ├── routes/            # 路由配置
│   │   ├── middleware/        # 中间件
│   │   ├── services/          # 业务服务
│   │   ├── utils/             # 工具函数
│   │   ├── database/          # 数据库配置
│   │   └── config/            # 配置文件
│   ├── package.json           # 后端依赖配置
│   └── .env.example           # 环境变量示例
│
└── README.md                   # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.x 或更高版本
- **MongoDB**: 5.x 或更高版本
- **Redis**: 6.x 或更高版本 (可选)
- **npm**: 8.x 或更高版本

### 安装和运行

#### 1. 克隆项目
```bash
git clone https://github.com/guangteng888/potato-chat.git
cd potato-chat/PotatoChatAdmin
```

#### 2. 安装依赖

**前端依赖**
```bash
cd frontend
npm install
```

**后端依赖**
```bash
cd ../backend
npm install
```

#### 3. 环境配置

复制环境变量示例文件并配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下关键参数：
```env
# 数据库连接
MONGODB_URI=mongodb://localhost:27017/potato_chat

# JWT密钥
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# 邮件服务
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### 4. 启动服务

**启动后端服务**
```bash
cd backend
npm run dev
```
后端服务将运行在 `http://localhost:5000`

**启动前端应用**
```bash
cd frontend
npm run dev
```
前端应用将运行在 `http://localhost:3000`

#### 5. 访问管理后台

打开浏览器访问 `http://localhost:3000`

**默认管理员账户**：
- 用户名：`admin`
- 密码：`admin123`

## 📊 功能模块详解

### 🏠 仪表板
- **实时统计** - 用户数量、消息数量、交易金额等关键指标
- **趋势图表** - 用户活跃度、消息统计、交易趋势可视化
- **系统状态** - 服务器状态、数据库连接、系统健康度监控
- **最近活动** - 用户注册、交易警告、系统事件实时展示

### 👥 用户管理
- **用户列表** - 分页展示、搜索筛选、批量操作
- **用户详情** - 个人信息、账户状态、交易记录、登录历史
- **权限控制** - 用户等级管理、功能权限分配
- **状态管理** - 账户激活/封禁、实名认证状态

### 💬 内容管理
- **消息审核** - 聊天内容监控、违规消息处理
- **群组管理** - 聊天群组创建、成员管理、权限设置
- **内容过滤** - 敏感词过滤、图片内容检测
- **举报处理** - 用户举报处理、违规用户处罚

### 📈 交易管理
- **交易监控** - 实时交易数据、异常交易检测
- **风险控制** - 大额交易预警、可疑交易标记
- **资金管理** - 用户余额管理、充值提现审核
- **手续费设置** - 交易手续费配置、优惠活动管理

### 📊 数据分析
- **用户分析** - 用户增长趋势、活跃度分析、留存率统计
- **业务分析** - 交易量统计、收入分析、平台使用情况
- **行为分析** - 用户行为路径、功能使用频率
- **报表导出** - 数据报表生成、Excel/PDF导出

### ⚙️ 系统设置
- **基础配置** - 平台名称、Logo、联系方式
- **功能开关** - 注册开关、交易开关、维护模式
- **参数配置** - 交易限额、手续费率、安全参数
- **通知设置** - 邮件模板、推送配置、短信设置

## 🔐 安全特性

### 认证和授权
- **JWT认证** - 无状态的用户认证机制
- **角色权限** - 基于角色的访问控制(RBAC)
- **会话管理** - 安全的会话生命周期管理
- **双因素认证** - 可选的2FA安全验证

### 数据安全
- **密码加密** - bcrypt强加密算法
- **数据验证** - 输入数据严格验证和清理
- **SQL注入防护** - 参数化查询防止注入攻击
- **XSS防护** - 输出编码防止跨站脚本攻击

### 系统安全
- **速率限制** - API请求频率限制
- **CORS配置** - 跨域资源共享安全配置
- **安全头** - Helmet中间件设置安全HTTP头
- **日志审计** - 操作日志记录和审计追踪

## 🔧 开发指南

### API接口

#### 认证接口
```
POST /api/auth/login          # 管理员登录
POST /api/auth/logout         # 登出
GET  /api/auth/me             # 获取当前用户信息
POST /api/auth/refresh-token  # 刷新访问令牌
```

#### 用户管理接口
```
GET    /api/users             # 获取用户列表
GET    /api/users/:id         # 获取用户详情
PUT    /api/users/:id         # 更新用户信息
DELETE /api/users/:id         # 删除用户
POST   /api/users/:id/ban     # 封禁用户
POST   /api/users/:id/unban   # 解封用户
```

#### 数据分析接口
```
GET /api/analytics/dashboard  # 仪表板数据
GET /api/analytics/users      # 用户统计数据
GET /api/analytics/trading    # 交易统计数据
GET /api/analytics/messages   # 消息统计数据
```

### 前端组件

#### 通用组件
- `Layout` - 页面布局组件
- `DataTable` - 数据表格组件
- `Chart` - 图表组件
- `Modal` - 模态对话框组件
- `Form` - 表单组件

#### 页面组件
- `Dashboard` - 仪表板页面
- `UserManagement` - 用户管理页面
- `ContentManagement` - 内容管理页面
- `TradingManagement` - 交易管理页面
- `Analytics` - 数据分析页面

### 数据库设计

#### 用户模型 (User)
```javascript
{
  username: String,        // 用户名
  email: String,          // 邮箱
  password: String,       // 密码(加密)
  profile: {              // 个人信息
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  account: {              // 账户信息
    status: String,       // 状态: active/inactive/banned
    level: String,        // 等级: basic/premium/vip
    balance: Number,      // 余额
    verified: Object      // 验证状态
  },
  activity: {             // 活动记录
    lastLogin: Date,
    loginCount: Number,
    ipAddresses: Array
  }
}
```

## 🧪 测试

### 运行测试
```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend
npm test
```

### 测试覆盖率
```bash
npm run test:coverage
```

## 📦 部署

### 生产构建

**前端构建**
```bash
cd frontend
npm run build
```

**后端准备**
```bash
cd backend
npm install --production
```

### Docker部署

```bash
# 构建镜像
docker build -t potato-chat-admin .

# 运行容器
docker run -p 5000:5000 -p 3000:3000 potato-chat-admin
```

### 环境变量配置

生产环境需要配置以下关键环境变量：
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-domain.com
```

## 📈 性能优化

### 前端优化
- **代码分割** - React.lazy实现路由级代码分割
- **缓存策略** - React Query缓存API响应
- **图片优化** - 图片懒加载和压缩
- **Bundle分析** - Webpack Bundle Analyzer分析包大小

### 后端优化
- **数据库索引** - MongoDB查询性能优化
- **缓存机制** - Redis缓存热点数据
- **连接池** - 数据库连接池管理
- **压缩中间件** - Gzip响应压缩

## 🐛 故障排除

### 常见问题

**1. 数据库连接失败**
```bash
# 检查MongoDB服务状态
sudo systemctl status mongod

# 检查连接字符串
echo $MONGODB_URI
```

**2. JWT认证失败**
```bash
# 检查JWT密钥配置
echo $JWT_SECRET
```

**3. 前端构建失败**
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

## 🤝 贡献指南

1. Fork 项目仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 Prettier 代码格式化
- 编写单元测试覆盖新功能
- 提交信息遵循 Conventional Commits

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../LICENSE) 文件了解详情。

## 📞 支持

- **文档**: [项目Wiki](https://github.com/guangteng888/potato-chat/wiki)
- **问题反馈**: [GitHub Issues](https://github.com/guangteng888/potato-chat/issues)
- **功能建议**: [GitHub Discussions](https://github.com/guangteng888/potato-chat/discussions)

---

<div align="center">

**🥔 Potato Chat 管理后台 - 让平台管理更简单！**

Made with ❤️ by Potato Chat Team

</div>

