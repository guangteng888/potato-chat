# 🥔 Potato Chat - 跨平台社交金融应用

<div align="center">

![Potato Chat Logo](https://img.shields.io/badge/Potato-Chat-FF6B35?style=for-the-badge&logo=chat&logoColor=white)

**一个集成聊天、交易和资产管理的现代化跨平台应用**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20iOS%20%7C%20Web-lightgrey)](https://github.com/guangteng888/potato-chat)
[![JavaScript](https://img.shields.io/badge/JavaScript-68.9%25-yellow)](https://github.com/guangteng888/potato-chat)
[![TypeScript](https://img.shields.io/badge/TypeScript-23.7%25-blue)](https://github.com/guangteng888/potato-chat)

</div>

## 📖 项目简介

Potato Chat 是一个创新的跨平台社交金融应用，将即时通讯、智能交易和资产管理完美融合。采用现代化技术栈构建，支持桌面端、移动端和Web端，为用户提供统一的社交金融体验。

### ✨ 核心特性

- 🗨️ **即时聊天** - 投资者社区实时交流
- 📈 **智能交易** - AI辅助投资决策系统
- 💰 **资产管理** - 一站式投资组合管理
- 👤 **个人中心** - 完善的用户体系和设置
- 🎨 **统一设计** - Potato橙色主题，现代化UI/UX
- 🔄 **跨平台同步** - 数据在所有设备间无缝同步

## 🚀 快速开始

### 📋 环境要求

在开始之前，请确保您的系统已安装以下软件：

#### 基础环境
- **Node.js**: 18.x 或更高版本 ([下载地址](https://nodejs.org/))
- **npm**: 8.x 或更高版本 (随Node.js安装)
- **Git**: 最新版本 ([下载地址](https://git-scm.com/))

#### 移动开发环境
- **Java JDK**: 17 或更高版本 (Android开发)
- **Android Studio**: 最新版本 ([下载地址](https://developer.android.com/studio))
- **Android SDK**: API Level 34
- **Xcode**: 14.x 或更高版本 (iOS开发，仅macOS)

#### 可选工具
- **Yarn**: 替代npm的包管理器
- **pnpm**: 高性能的包管理器

### 📥 安装步骤

#### 1. 克隆仓库

```bash
# 使用HTTPS克隆
git clone https://github.com/guangteng888/potato-chat.git

# 或使用SSH克隆
git clone git@github.com:guangteng888/potato-chat.git

# 进入项目目录
cd potato-chat
```

#### 2. 安装依赖

```bash
# 安装桌面应用依赖
cd PotatoChatDesktop
npm install
cd potato-chat-desktop-frontend
npm install
cd ../..

# 安装Web应用依赖
cd potato-chat-web
npm install
cd ..

# 安装Android应用依赖
cd PotatoChatMobile
npm install
cd ..

# 安装iOS应用依赖
cd PotatoChatIOS
npm install
cd ..

# 安装管理后台依赖
cd PotatoChatAdmin/frontend
npm install
cd ../backend
npm install
cd ../..
```

#### 3. 环境配置

##### 后端服务配置
```bash
# 复制环境变量文件
cd PotatoChatAdmin/backend
cp .env.example .env

# 编辑环境变量
nano .env
```

在 `.env` 文件中配置以下参数：
```env
# 服务器配置
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/potatochat
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# 邮件服务配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 文件上传配置
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
```

##### Android开发环境配置
```bash
# 设置Android SDK路径
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 创建local.properties文件
cd PotatoChatMobile/android
echo "sdk.dir=$ANDROID_HOME" > local.properties
```

## 🏃‍♂️ 运行应用

### 🖥️ 桌面应用

```bash
# 开发模式运行
cd PotatoChatDesktop
npm run dev

# 构建生产版本
npm run build:win    # Windows版本
npm run build:mac    # macOS版本
npm run build:linux  # Linux版本
npm run build:all    # 所有平台
```

**构建产物位置：**
- Windows: `dist/Potato Chat Setup 1.0.0.exe`
- macOS: `dist/Potato Chat-1.0.0.dmg`
- Linux: `dist/Potato Chat-1.0.0.AppImage`

### 🌐 Web应用

```bash
# 开发服务器
cd potato-chat-web
npm run dev          # 启动开发服务器 (http://localhost:3000)

# 生产构建
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

### 📱 Android应用

#### 使用Android Studio
1. 打开Android Studio
2. 选择 "Open an existing project"
3. 导航到 `PotatoChatMobile/android` 目录
4. 点击 "OK" 打开项目
5. 等待Gradle同步完成
6. 点击 "Run" 按钮运行应用

#### 使用命令行
```bash
cd PotatoChatMobile

# 启动React Native开发服务器
npx react-native start

# 在新终端中运行Android应用
npx react-native run-android

# 或直接构建APK
cd android
./gradlew assembleDebug         # 调试版本
./gradlew assembleRelease       # 发布版本
```

**APK文件位置：**
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

### 🍎 iOS应用

```bash
cd PotatoChatIOS

# 安装iOS依赖
cd ios && pod install && cd ..

# 启动Metro服务器
npx react-native start

# 在新终端中运行iOS应用
npx react-native run-ios

# 或使用Xcode
open ios/PotatoChatIOS.xcworkspace
```

### 🔧 管理后台

#### 启动后端服务
```bash
cd PotatoChatAdmin/backend

# 确保MongoDB和Redis正在运行
# MongoDB: mongod
# Redis: redis-server

# 启动后端服务
npm run dev          # 开发模式 (http://localhost:5000)
npm start           # 生产模式
```

#### 启动前端界面
```bash
cd PotatoChatAdmin/frontend

# 启动前端开发服务器
npm run dev          # 开发模式 (http://localhost:3000)
npm run build        # 构建生产版本
```

**默认管理员账户：**
- 用户名: `admin`
- 密码: `admin123`

## 🔧 全平台构建

使用提供的构建脚本可以一键构建所有平台：

```bash
# 给脚本执行权限
chmod +x build-scripts/build-all.sh

# 构建所有平台
./build-scripts/build-all.sh all

# 构建特定平台
./build-scripts/build-all.sh desktop    # 仅桌面应用
./build-scripts/build-all.sh mobile     # 仅移动应用
./build-scripts/build-all.sh web        # 仅Web应用
```

## 📱 应用安装

### 🖥️ 桌面应用安装

#### Windows
1. 下载 `Potato Chat Setup 1.0.0.exe`
2. 双击运行安装程序
3. 按照向导完成安装
4. 从开始菜单启动应用

#### macOS
1. 下载 `Potato Chat-1.0.0.dmg`
2. 双击挂载磁盘镜像
3. 将应用拖拽到Applications文件夹
4. 从Launchpad启动应用

#### Linux
1. 下载 `Potato Chat-1.0.0.AppImage`
2. 给文件执行权限：`chmod +x Potato\ Chat-1.0.0.AppImage`
3. 双击运行或命令行执行：`./Potato\ Chat-1.0.0.AppImage`

### 📱 Android应用安装

#### 从APK安装
1. 下载 `app-release.apk` 文件
2. 在Android设备上启用"未知来源"安装
3. 使用文件管理器打开APK文件
4. 点击"安装"完成安装

#### 使用ADB安装
```bash
# 确保设备已连接并启用USB调试
adb devices

# 安装APK
adb install app-release.apk

# 卸载应用
adb uninstall com.potatochat.mobile
```

### 🍎 iOS应用安装

#### 开发者安装
1. 使用Xcode打开项目
2. 连接iOS设备
3. 选择设备作为运行目标
4. 点击"Run"按钮安装到设备

#### TestFlight分发
1. 上传到App Store Connect
2. 创建TestFlight测试版本
3. 邀请测试用户
4. 用户通过TestFlight安装

## 🏗️ 技术架构

### 桌面应用 (Electron + React)
- **框架**: Electron 28.x
- **前端**: React 18 + TypeScript
- **UI库**: shadcn/ui + Tailwind CSS
- **构建工具**: Vite + electron-builder
- **支持平台**: Windows, macOS, Linux

### 移动应用
#### Android (原生 + React Native)
- **原生开发**: Java + Android SDK
- **混合开发**: React Native + TypeScript
- **UI框架**: Material Design
- **构建工具**: Gradle + Android Studio

#### iOS (React Native)
- **框架**: React Native + TypeScript
- **导航**: React Navigation
- **状态管理**: Redux Toolkit
- **构建工具**: Xcode + Metro

### Web应用 (React)
- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **构建工具**: Vite
- **部署**: 静态文件服务器

### 管理后台 (React + Node.js)
- **前端**: React 18 + TypeScript + Tailwind CSS
- **后端**: Node.js + Express + MongoDB
- **认证**: JWT + 刷新令牌
- **实时通信**: Socket.IO

## 📁 项目结构

```
potato-chat/
├── PotatoChatDesktop/          # 桌面应用
│   ├── main.js                 # Electron主进程
│   ├── preload.js              # 预加载脚本
│   ├── package.json            # 依赖配置
│   └── potato-chat-desktop-frontend/  # React前端
│       ├── src/
│       │   ├── App.jsx         # 主应用组件
│       │   ├── components/     # UI组件库
│       │   └── services/       # API服务
│       ├── index.html          # 入口HTML
│       └── vite.config.js      # Vite配置
│
├── PotatoChatMobile/           # Android应用
│   ├── android/                # Android原生代码
│   │   ├── app/
│   │   │   ├── src/main/java/  # Java源代码
│   │   │   └── src/main/res/   # 资源文件
│   │   └── build.gradle        # 构建配置
│   ├── src/                    # React Native代码
│   │   ├── screens/            # 屏幕组件
│   │   ├── navigation/         # 导航配置
│   │   ├── services/           # API服务
│   │   └── utils/              # 工具函数
│   └── package.json            # 依赖配置
│
├── PotatoChatIOS/              # iOS应用
│   ├── ios/                    # iOS原生配置
│   ├── src/                    # React Native代码
│   │   ├── screens/            # 屏幕组件
│   │   ├── navigation/         # 导航系统
│   │   └── store/              # 状态管理
│   └── package.json            # 依赖配置
│
├── potato-chat-web/            # Web应用
│   ├── src/
│   │   ├── App.jsx             # 主应用组件
│   │   ├── components/         # UI组件
│   │   ├── services/           # API服务
│   │   └── lib/                # 工具函数
│   ├── index.html              # 入口HTML
│   └── vite.config.js          # Vite配置
│
├── PotatoChatAdmin/            # 管理后台
│   ├── frontend/               # 前端界面
│   │   ├── src/
│   │   │   ├── pages/          # 页面组件
│   │   │   ├── components/     # UI组件
│   │   │   └── services/       # API服务
│   │   └── package.json        # 依赖配置
│   └── backend/                # 后端服务
│       ├── src/
│       │   ├── controllers/    # 控制器
│       │   ├── models/         # 数据模型
│       │   ├── routes/         # 路由配置
│       │   └── services/       # 业务服务
│       └── package.json        # 依赖配置
│
├── build-scripts/              # 构建脚本
│   └── build-all.sh            # 全平台构建脚本
│
├── .gitignore                  # Git忽略文件
└── README.md                   # 项目说明文档
```

## 🎯 核心功能

### 🏠 主页模块
- 📊 **数据概览** - 实时市场数据和投资组合概览
- 🔔 **消息通知** - 重要市场动态和系统通知
- 🎯 **快速操作** - 常用功能快速入口

### 💬 聊天模块
- 💬 **实时聊天** - 支持文字、表情、图片消息
- 👥 **群组聊天** - 投资者社区和兴趣小组
- 🔍 **消息搜索** - 快速查找历史消息
- 📎 **文件分享** - 支持文档和媒体文件分享

### 📈 交易模块
- 📈 **实时行情** - 股票、基金、数字货币行情
- 💹 **智能分析** - AI驱动的投资建议
- ⚡ **快速交易** - 一键买卖操作
- 📊 **图表分析** - 专业的技术分析工具

### 👤 个人中心
- 👤 **个人资料** - 用户信息管理
- 🔐 **安全设置** - 密码、双因素认证
- 🎨 **主题设置** - 个性化界面定制
- 📱 **设备管理** - 多设备登录管理

## 🎨 设计系统

### 🎨 色彩方案
- **主色调**: Potato Orange (#FF6B35)
- **辅助色**: 深灰 (#2D3748), 浅灰 (#F7FAFC)
- **强调色**: 绿色 (#48BB78), 红色 (#F56565)

### 🔤 字体系统
- **主字体**: Inter, system-ui, sans-serif
- **代码字体**: 'Fira Code', 'Consolas', monospace

### 🧩 组件库
基于 shadcn/ui 构建的统一组件库，包含：
- 按钮、输入框、卡片等基础组件
- 图表、表格等数据展示组件
- 对话框、抽屉等交互组件

## 📦 构建产物

### 🖥️ 桌面应用
- **Windows**: `.exe` 安装程序 + `.zip` 便携版
- **macOS**: `.dmg` 安装镜像 + `.zip` 应用包
- **Linux**: `.AppImage` 便携版 + `.deb` 安装包

### 📱 移动应用
- **Android**: `.apk` 安装包 + `.aab` 应用包
- **iOS**: `.ipa` 安装包 (需要Apple开发者账户)

### 🌐 Web应用
- 静态文件部署到任何Web服务器
- 支持CDN加速和PWA功能
- 响应式设计，适配所有设备

## 🔧 故障排除

### 常见问题

#### Node.js版本问题
```bash
# 检查Node.js版本
node --version

# 如果版本过低，请升级到18.x或更高版本
# 推荐使用nvm管理Node.js版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Android构建问题
```bash
# 清理Gradle缓存
cd PotatoChatMobile/android
./gradlew clean

# 重新构建
./gradlew assembleDebug
```

#### iOS构建问题
```bash
# 清理iOS构建缓存
cd PotatoChatIOS/ios
rm -rf build/
rm -rf ~/Library/Developer/Xcode/DerivedData/

# 重新安装Pod依赖
pod deintegrate
pod install
```

#### 依赖安装问题
```bash
# 清理npm缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

### 获取帮助

如果遇到问题，可以通过以下方式获取帮助：

1. **查看文档**: 阅读项目文档和README
2. **检查Issues**: 在GitHub Issues中搜索相关问题
3. **提交Issue**: 如果问题未解决，请提交新的Issue
4. **社区讨论**: 在GitHub Discussions中参与讨论

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

### 贡献流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 编写单元测试覆盖核心功能
- 提交信息遵循 Conventional Commits 规范

### 代码风格
```bash
# 安装开发依赖
npm install --save-dev eslint prettier

# 运行代码检查
npm run lint

# 自动修复代码风格
npm run lint:fix

# 格式化代码
npm run format
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和技术：

- [Electron](https://electronjs.org/) - 跨平台桌面应用框架
- [React](https://reactjs.org/) - 用户界面构建库
- [React Native](https://reactnative.dev/) - 跨平台移动应用框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - 现代化UI组件库
- [Node.js](https://nodejs.org/) - JavaScript运行时环境
- [MongoDB](https://www.mongodb.com/) - 文档数据库
- [Socket.IO](https://socket.io/) - 实时通信库

## 📞 联系我们

- **项目主页**: [https://github.com/guangteng888/potato-chat](https://github.com/guangteng888/potato-chat)
- **问题反馈**: [https://github.com/guangteng888/potato-chat/issues](https://github.com/guangteng888/potato-chat/issues)
- **功能建议**: [https://github.com/guangteng888/potato-chat/discussions](https://github.com/guangteng888/potato-chat/discussions)

---

<div align="center">

**🥔 用 Potato Chat，让投资更简单！**

Made with ❤️ by Potato Chat Team

</div>



## 💼 商业模式

Potato Chat 采用多元化的商业模式，构建可持续的盈利体系：

### 🎯 六大核心盈利点

#### 1. 📊 订阅服务 (35% 收入占比)
- **基础版** ($9.99/月): 无广告体验 + 基础交易功能
- **专业版** ($29.99/月): 高级工具 + API访问 + 优先支持
- **企业版** ($99.99/月): 定制化服务 + 白标解决方案

#### 2. 💸 交易手续费 (28% 收入占比)
- **现货交易**: 0.08%-0.2% (基于用户等级)
- **期货交易**: 0.05%-0.15%
- **期权交易**: $2.5-$5/张合约
- **VIP费率**: 最低0.05%

#### 3. 📺 广告收入 (18% 收入占比)
- **展示广告**: CPM $2.5-$8.0
- **视频广告**: CPM $12.0-$25.0
- **原生广告**: CPM $8.0-$15.0
- **精准投放**: 基于用户画像和交易行为

#### 4. 🤖 AI交易策略 (12% 收入占比)
- **动量追踪AI**: $19.99-$99.99/月
- **套利机会AI**: $29.99-$149.99/月
- **情绪分析AI**: $24.99-$119.99/月
- **波动率交易AI**: $39.99-$179.99/月

#### 5. 📈 高级数据服务 (4% 收入占比)
- **实时数据流**: $99.99-$799.99/月
- **历史数据**: $39.99-$249.99/月
- **AI智能洞察**: $79.99-$499.99/月
- **定制报告**: $49.99-$299.99/月

#### 6. 🎮 虚拟商品 (3% 收入占比)
- **主题皮肤**: 199-599金币
- **头像框**: 299-499金币
- **表情包**: 199-399金币
- **功能增强**: 199-999金币

### 📊 收入预测

| 年份 | 总收入 | 增长率 | 用户规模 |
|------|--------|--------|----------|
| 2024 | $23.2M | - | 300万 |
| 2025 | $32.5M | 40% | 500万 |
| 2026 | $45.8M | 41% | 800万 |

### 🎯 目标市场

- **个人投资者**: 全球1.5亿活跃加密货币投资者
- **专业交易者**: 50万专业交易者
- **机构投资者**: 5,000家加密货币相关机构

### 🏆 竞争优势

- **社交化交易**: 独特的社交+交易融合体验
- **AI技术驱动**: 专业级AI交易策略和数据分析
- **多元化收入**: 降低单一收入依赖风险
- **网络效应**: 用户越多，价值越大

详细商业模式分析请参考：[商业模式综合报告](./docs/business-model-report.md)


