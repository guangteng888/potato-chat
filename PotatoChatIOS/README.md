# 🍎 Potato Chat iOS 应用

## 📱 项目概述

Potato Chat iOS版是基于React Native开发的跨平台移动应用，为iOS用户提供完整的社交金融体验。

## ✨ 核心功能

### 🏠 **主要模块**
- **首页** - 数据概览、快速导航、实时信息
- **聊天** - 实时消息、群组聊天、多媒体支持
- **交易** - 加密货币交易、实时行情、投资组合
- **个人中心** - 用户资料、设置管理、账户信息

### 🔧 **技术特性**
- **React Native** - 跨平台原生性能
- **Redux Toolkit** - 现代化状态管理
- **React Navigation** - 流畅的导航体验
- **TypeScript** - 类型安全的开发体验
- **Vector Icons** - 丰富的图标库
- **Chart Kit** - 专业的图表展示

## 🏗️ 项目架构

```
PotatoChatIOS/
├── src/
│   ├── navigation/          # 导航配置
│   │   └── AppNavigator.tsx # 主导航器
│   ├── screens/             # 屏幕组件
│   │   ├── LoginScreen.tsx  # 登录屏幕
│   │   ├── HomeScreen.tsx   # 首页屏幕
│   │   ├── ChatScreen.tsx   # 聊天列表
│   │   ├── ChatDetailScreen.tsx # 聊天详情
│   │   ├── TradingScreen.tsx # 交易屏幕
│   │   ├── TradingDetailScreen.tsx # 交易详情
│   │   ├── ProfileScreen.tsx # 个人中心
│   │   └── SettingsScreen.tsx # 设置页面
│   └── store/               # 状态管理
│       └── store.ts         # Redux store配置
├── ios/                     # iOS原生代码
├── android/                 # Android原生代码
├── App.tsx                  # 应用入口
├── index.js                 # 注册入口
└── package.json             # 依赖配置
```

## 🚀 开发环境设置

### **环境要求**
- **Node.js**: 16.x 或更高版本
- **React Native CLI**: 最新版本
- **Xcode**: 14.x 或更高版本 (iOS开发)
- **Android Studio**: 最新版本 (Android开发)
- **iOS Simulator** 或 **物理设备**

### **安装依赖**
```bash
# 安装Node.js依赖
npm install

# iOS依赖 (仅macOS)
cd ios && pod install && cd ..
```

### **运行应用**
```bash
# 启动Metro服务器
npm start

# 运行iOS版本 (需要macOS)
npm run ios

# 运行Android版本
npm run android
```

## 📱 功能详解

### 🔐 **认证系统**
- **登录/注册** - 用户名密码认证
- **社交登录** - Apple ID、Google、Facebook
- **生物识别** - Touch ID、Face ID支持
- **自动登录** - 安全的会话管理

### 💬 **聊天功能**
- **实时消息** - WebSocket实时通信
- **群组聊天** - 多人聊天室
- **消息类型** - 文本、图片、文件支持
- **消息状态** - 已读、未读状态管理

### 📈 **交易功能**
- **实时行情** - 加密货币价格数据
- **交易图表** - K线图、趋势分析
- **买卖操作** - 市价单、限价单
- **投资组合** - 持仓管理、收益统计

### ⚙️ **设置管理**
- **个人资料** - 头像、昵称、邮箱管理
- **安全设置** - 密码修改、双重验证
- **应用偏好** - 主题、语言、通知设置
- **交易设置** - 风险等级、价格提醒

## 🎨 设计规范

### **色彩方案**
- **主色调**: #FF6B35 (橙色)
- **成功色**: #34C759 (绿色)
- **危险色**: #FF3B30 (红色)
- **文字色**: #1C1C1E (深灰)
- **辅助色**: #8E8E93 (浅灰)

### **字体规范**
- **标题**: 20-32px, Bold
- **正文**: 14-16px, Regular
- **辅助**: 10-12px, Regular

### **间距规范**
- **页面边距**: 20px
- **组件间距**: 15px
- **内容间距**: 10px

## 🔧 开发指南

### **代码规范**
- **TypeScript** - 严格类型检查
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **组件化** - 可复用组件设计

### **状态管理**
- **Redux Toolkit** - 现代化Redux
- **Redux Persist** - 状态持久化
- **Async Storage** - 本地存储

### **导航管理**
- **Stack Navigator** - 页面堆栈导航
- **Tab Navigator** - 底部标签导航
- **深度链接** - URL路由支持

## 📦 构建和部署

### **开发构建**
```bash
# iOS开发构建
npm run build:ios

# Android开发构建
npm run build:android
```

### **生产构建**
```bash
# iOS生产构建 (需要Xcode)
# 在Xcode中选择 Product > Archive

# Android生产构建
cd android && ./gradlew assembleRelease
```

### **应用商店发布**
1. **iOS App Store**
   - 使用Xcode Archive功能
   - 通过App Store Connect上传
   - 提交审核

2. **Google Play Store**
   - 生成签名APK/AAB
   - 通过Google Play Console上传
   - 提交审核

## 🧪 测试

### **单元测试**
```bash
npm test
```

### **集成测试**
```bash
npm run test:e2e
```

### **性能测试**
- **Flipper** - 调试和性能分析
- **React DevTools** - 组件调试
- **Metro** - 打包分析

## 🔒 安全特性

### **数据安全**
- **加密存储** - 敏感数据加密
- **网络安全** - HTTPS通信
- **输入验证** - 防止恶意输入

### **认证安全**
- **JWT令牌** - 安全的身份验证
- **生物识别** - 本地身份验证
- **会话管理** - 安全的会话控制

## 📈 性能优化

### **渲染优化**
- **FlatList** - 大列表虚拟化
- **Image缓存** - 图片缓存机制
- **懒加载** - 按需加载组件

### **内存优化**
- **组件卸载** - 及时清理资源
- **事件监听** - 避免内存泄漏
- **状态管理** - 合理的状态设计

## 🐛 调试指南

### **常见问题**
1. **Metro服务器启动失败**
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS构建失败**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android构建失败**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

### **调试工具**
- **React Native Debugger** - 专业调试工具
- **Flipper** - Facebook官方调试平台
- **Chrome DevTools** - 浏览器调试

## 📚 学习资源

### **官方文档**
- [React Native官方文档](https://reactnative.dev/)
- [React Navigation文档](https://reactnavigation.org/)
- [Redux Toolkit文档](https://redux-toolkit.js.org/)

### **社区资源**
- [React Native中文网](https://reactnative.cn/)
- [Awesome React Native](https://github.com/jondot/awesome-react-native)

## 🤝 贡献指南

### **开发流程**
1. Fork项目仓库
2. 创建功能分支
3. 提交代码更改
4. 创建Pull Request
5. 代码审查和合并

### **提交规范**
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- **项目主页**: https://github.com/guangteng888/potato-chat
- **问题反馈**: https://github.com/guangteng888/potato-chat/issues
- **邮箱**: support@potatochat.com

---

<div align="center">

**🍎 Potato Chat iOS - 原生性能的社交金融体验！**

Made with ❤️ by Potato Chat Team

</div>

