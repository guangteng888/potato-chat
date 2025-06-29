const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用信息
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 通知功能
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
  
  // 菜单事件监听
  onMenuNewChat: (callback) => ipcRenderer.on('menu-new-chat', callback),
  onMenuAbout: (callback) => ipcRenderer.on('menu-about', callback),
  
  // 移除监听器
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // 平台信息
  platform: process.platform,
  
  // 环境信息
  isDev: process.env.NODE_ENV === 'development'
});

// 窗口控制API
contextBridge.exposeInMainWorld('windowAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized')
});

// 系统API
contextBridge.exposeInMainWorld('systemAPI', {
  openExternal: (url) => ipcRenderer.send('open-external', url),
  showItemInFolder: (path) => ipcRenderer.send('show-item-in-folder', path)
});

// 应用状态API
contextBridge.exposeInMainWorld('appAPI', {
  onAppReady: (callback) => ipcRenderer.on('app-ready', callback),
  onAppWillQuit: (callback) => ipcRenderer.on('app-will-quit', callback)
});

console.log('Preload script loaded successfully');

