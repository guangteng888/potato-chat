# 🥔 Potato Chat - 跨平台社交金融应用

<div align="center">

![Potato Chat Logo](https://img.shields.io/badge/Potato-Chat-FF6B35?style=for-the-badge&logo=chat&logoColor=white)

**一个集成聊天、交易和资产管理的现代化跨平台应用**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20iOS%20%7C%20Web-lightgrey)](https://github.com/guangteng888/potato-chat)
[![JavaScript](https://img.shields.io/badge/JavaScript-74.7%25-yellow)](https://github.com/guangteng888/potato-chat)
[![TypeScript](https://img.shields.io/badge/TypeScript-20.4%25-blue)](https://github.com/guangteng888/potato-chat)

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
│       │   └── components/     # UI组件库
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
│   │   └── store/              # 状态管理
│   └── package.json            # 依赖配置
│
├── PotatoChatIOS/              # iOS应用
│   ├── ios/                    # iOS原生配置
│   ├── src/                    # React Native代码
│   │   └── screens/            # 屏幕组件
│   └── package.json            # 依赖配置
│
├── potato-chat-web/            # Web应用
│   ├── src/
│   │   ├── App.jsx             # 主应用组件
│   │   ├── components/         # UI组件
│   │   └── lib/                # 工具函数
│   ├── index.html              # 入口HTML
│   └── vite.config.js          # Vite配置
│
├── build-scripts/              # 构建脚本
│   └── build-all.sh            # 全平台构建脚本
│
├── .gitignore                  # Git忽略文件
└── README.md                   # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.x 或更高版本
- **npm**: 8.x 或更高版本
- **Java**: JDK 17 (Android开发)
- **Android SDK**: API 34 (Android开发)
- **Xcode**: 14.x (iOS开发，仅macOS)

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/guangteng888/potato-chat.git
cd potato-chat

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

# 安装移动应用依赖
cd PotatoChatMobile
npm install
cd ..

cd PotatoChatIOS
npm install
cd ..
```

### 开发运行

#### 桌面应用
```bash
cd PotatoChatDesktop
npm run dev          # 开发模式
npm run build:win    # 构建Windows版本
npm run build:mac    # 构建macOS版本
npm run build:linux  # 构建Linux版本
```

#### Web应用
```bash
cd potato-chat-web
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run preview      # 预览构建结果
```

#### Android应用
```bash
cd PotatoChatMobile
npx react-native run-android    # 运行React Native版本

# 或构建原生版本
cd android
./gradlew assembleDebug         # 调试版本
./gradlew assembleRelease       # 发布版本
```

#### iOS应用
```bash
cd PotatoChatIOS
npx react-native run-ios        # 运行iOS模拟器
```

### 一键构建所有平台
```bash
chmod +x build-scripts/build-all.sh
./build-scripts/build-all.sh all
```

## 📱 应用功能

### 主页面
- 📊 **数据概览** - 实时市场数据和投资组合概览
- 🔔 **消息通知** - 重要市场动态和系统通知
- 🎯 **快速操作** - 常用功能快速入口

### 聊天功能
- 💬 **实时聊天** - 支持文字、表情、图片消息
- 👥 **群组聊天** - 投资者社区和兴趣小组
- 🔍 **消息搜索** - 快速查找历史消息
- 📎 **文件分享** - 支持文档和媒体文件分享

### 交易功能
- 📈 **实时行情** - 股票、基金、数字货币行情
- 💹 **智能分析** - AI驱动的投资建议
- ⚡ **快速交易** - 一键买卖操作
- 📊 **图表分析** - 专业的技术分析工具

### 个人中心
- 👤 **个人资料** - 用户信息管理
- 🔐 **安全设置** - 密码、双因素认证
- 🎨 **主题设置** - 个性化界面定制
- 📱 **设备管理** - 多设备登录管理

## 🎨 设计系统

### 主题色彩
- **主色调**: Potato Orange (#FF6B35)
- **辅助色**: 深灰 (#2D3748), 浅灰 (#F7FAFC)
- **强调色**: 绿色 (#48BB78), 红色 (#F56565)

### 字体规范
- **主字体**: Inter, system-ui, sans-serif
- **代码字体**: 'Fira Code', 'Consolas', monospace

### 组件库
基于 shadcn/ui 构建的统一组件库，包含：
- 按钮、输入框、卡片等基础组件
- 图表、表格等数据展示组件
- 对话框、抽屉等交互组件

## 🔧 构建和部署

### 桌面应用构建产物
- **Windows**: `.exe` 安装程序 + `.zip` 便携版
- **macOS**: `.dmg` 安装镜像 + `.zip` 应用包
- **Linux**: `.AppImage` 便携版 + `.deb` 安装包

### 移动应用构建产物
- **Android**: `.apk` 安装包 + `.aab` 应用包
- **iOS**: `.ipa` 安装包 (需要Apple开发者账户)

### Web应用部署
- 静态文件部署到任何Web服务器
- 支持CDN加速和PWA功能
- 响应式设计，适配所有设备

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

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

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Electron](https://electronjs.org/) - 跨平台桌面应用框架
- [React](https://reactjs.org/) - 用户界面构建库
- [React Native](https://reactnative.dev/) - 跨平台移动应用框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - 现代化UI组件库

## 📞 联系我们

- **项目主页**: https://github.com/guangteng888/potato-chat
- **问题反馈**: https://github.com/guangteng888/potato-chat/issues
- **功能建议**: https://github.com/guangteng888/potato-chat/discussions

---

<div align="center">

**🥔 用 Potato Chat，让投资更简单！**

Made with ❤️ by Potato Chat Team

</div>

