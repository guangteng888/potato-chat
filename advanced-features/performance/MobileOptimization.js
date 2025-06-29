// 移动端性能优化工具集
class MobileOptimization {
  constructor() {
    this.isInitialized = false
    this.performanceMetrics = {
      startTime: Date.now(),
      loadTime: 0,
      memoryUsage: 0,
      batteryLevel: 0,
      networkType: 'unknown'
    }
    
    this.init()
  }

  // 初始化性能监控
  init() {
    if (this.isInitialized) return
    
    this.setupPerformanceObserver()
    this.setupMemoryMonitoring()
    this.setupNetworkMonitoring()
    this.setupBatteryMonitoring()
    this.setupImageLazyLoading()
    this.setupServiceWorker()
    
    this.isInitialized = true
    console.log('移动端性能优化已启用')
  }

  // 性能监控
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // 监控页面加载性能
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.performanceMetrics.loadTime = entry.loadEventEnd - entry.loadEventStart
            console.log(`页面加载时间: ${this.performanceMetrics.loadTime}ms`)
          }
          
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`LCP: ${entry.startTime}ms`)
          }
          
          if (entry.entryType === 'first-input') {
            console.log(`FID: ${entry.processingStart - entry.startTime}ms`)
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] })
    }
  }

  // 内存监控
  setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory
        this.performanceMetrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
        
        // 内存使用过高时触发垃圾回收建议
        if (this.performanceMetrics.memoryUsage > 100) {
          this.triggerMemoryCleanup()
        }
      }, 30000) // 每30秒检查一次
    }
  }

  // 网络监控
  setupNetworkMonitoring() {
    if ('connection' in navigator) {
      const connection = navigator.connection
      this.performanceMetrics.networkType = connection.effectiveType
      
      connection.addEventListener('change', () => {
        this.performanceMetrics.networkType = connection.effectiveType
        this.adaptToNetworkCondition(connection.effectiveType)
      })
    }
  }

  // 电池监控
  setupBatteryMonitoring() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        this.performanceMetrics.batteryLevel = battery.level * 100
        
        battery.addEventListener('levelchange', () => {
          this.performanceMetrics.batteryLevel = battery.level * 100
          this.adaptToBatteryLevel(battery.level)
        })
      })
    }
  }

  // 图片懒加载
  setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        })
      })

      // 观察所有懒加载图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  // Service Worker 设置
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker 注册成功:', registration)
        })
        .catch(error => {
          console.log('Service Worker 注册失败:', error)
        })
    }
  }

  // 根据网络条件调整
  adaptToNetworkCondition(effectiveType) {
    const settings = {
      'slow-2g': {
        imageQuality: 0.3,
        videoQuality: '240p',
        prefetchDisabled: true,
        animationsReduced: true
      },
      '2g': {
        imageQuality: 0.5,
        videoQuality: '360p',
        prefetchDisabled: true,
        animationsReduced: true
      },
      '3g': {
        imageQuality: 0.7,
        videoQuality: '480p',
        prefetchDisabled: false,
        animationsReduced: false
      },
      '4g': {
        imageQuality: 0.9,
        videoQuality: '720p',
        prefetchDisabled: false,
        animationsReduced: false
      }
    }

    const config = settings[effectiveType] || settings['4g']
    this.applyNetworkOptimizations(config)
  }

  // 应用网络优化
  applyNetworkOptimizations(config) {
    // 调整图片质量
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.originalSrc) {
        img.src = this.compressImage(img.dataset.originalSrc, config.imageQuality)
      }
    })

    // 禁用/启用预加载
    if (config.prefetchDisabled) {
      document.querySelectorAll('link[rel="prefetch"]').forEach(link => {
        link.remove()
      })
    }

    // 减少动画
    if (config.animationsReduced) {
      document.body.classList.add('reduce-animations')
    } else {
      document.body.classList.remove('reduce-animations')
    }
  }

  // 根据电池电量调整
  adaptToBatteryLevel(level) {
    if (level < 0.2) { // 电量低于20%
      // 启用省电模式
      this.enablePowerSaveMode()
    } else if (level > 0.5) { // 电量高于50%
      // 禁用省电模式
      this.disablePowerSaveMode()
    }
  }

  // 启用省电模式
  enablePowerSaveMode() {
    document.body.classList.add('power-save-mode')
    
    // 减少动画
    document.body.classList.add('reduce-animations')
    
    // 降低刷新频率
    this.reduceUpdateFrequency()
    
    // 暂停非关键功能
    this.pauseNonCriticalFeatures()
    
    console.log('省电模式已启用')
  }

  // 禁用省电模式
  disablePowerSaveMode() {
    document.body.classList.remove('power-save-mode')
    document.body.classList.remove('reduce-animations')
    
    // 恢复正常刷新频率
    this.restoreUpdateFrequency()
    
    // 恢复非关键功能
    this.resumeNonCriticalFeatures()
    
    console.log('省电模式已禁用')
  }

  // 内存清理
  triggerMemoryCleanup() {
    // 清理缓存
    this.clearImageCache()
    
    // 清理事件监听器
    this.cleanupEventListeners()
    
    // 清理定时器
    this.cleanupTimers()
    
    console.log('内存清理完成')
  }

  // 清理图片缓存
  clearImageCache() {
    // 移除不在视口内的图片
    document.querySelectorAll('img').forEach(img => {
      const rect = img.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      
      if (!isVisible && img.src) {
        img.dataset.originalSrc = img.src
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiLz48L3N2Zz4='
      }
    })
  }

  // 清理事件监听器
  cleanupEventListeners() {
    // 移除未使用的事件监听器
    // 这里需要根据具体应用实现
  }

  // 清理定时器
  cleanupTimers() {
    // 清理不必要的定时器
    // 这里需要根据具体应用实现
  }

  // 减少更新频率
  reduceUpdateFrequency() {
    // 降低实时数据更新频率
    window.updateInterval = Math.max((window.updateInterval || 1000) * 2, 5000)
  }

  // 恢复更新频率
  restoreUpdateFrequency() {
    // 恢复正常更新频率
    window.updateInterval = 1000
  }

  // 暂停非关键功能
  pauseNonCriticalFeatures() {
    // 暂停动画
    document.querySelectorAll('.animation').forEach(el => {
      el.style.animationPlayState = 'paused'
    })
    
    // 暂停视频自动播放
    document.querySelectorAll('video[autoplay]').forEach(video => {
      video.pause()
    })
  }

  // 恢复非关键功能
  resumeNonCriticalFeatures() {
    // 恢复动画
    document.querySelectorAll('.animation').forEach(el => {
      el.style.animationPlayState = 'running'
    })
    
    // 恢复视频自动播放
    document.querySelectorAll('video[autoplay]').forEach(video => {
      video.play()
    })
  }

  // 图片压缩
  compressImage(src, quality) {
    // 这里可以实现图片压缩逻辑
    // 或者返回不同质量的图片URL
    return src.replace(/\.(jpg|jpeg|png)$/, `_q${Math.floor(quality * 100)}.$1`)
  }

  // 获取性能指标
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      uptime: Date.now() - this.performanceMetrics.startTime
    }
  }

  // 启动时间优化
  static optimizeStartupTime() {
    // 预加载关键资源
    const criticalResources = [
      '/css/critical.css',
      '/js/app.min.js',
      '/fonts/main.woff2'
    ]
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = resource.endsWith('.css') ? 'style' : 
                resource.endsWith('.js') ? 'script' : 'font'
      if (link.as === 'font') {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })
  }

  // 代码分割和懒加载
  static async loadModule(moduleName) {
    try {
      const module = await import(`/modules/${moduleName}.js`)
      return module.default || module
    } catch (error) {
      console.error(`模块 ${moduleName} 加载失败:`, error)
      return null
    }
  }

  // 虚拟滚动实现
  static createVirtualScroll(container, items, itemHeight, renderItem) {
    const containerHeight = container.clientHeight
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
    let scrollTop = 0
    
    const render = () => {
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(startIndex + visibleCount, items.length)
      
      container.innerHTML = ''
      container.style.height = `${items.length * itemHeight}px`
      container.style.position = 'relative'
      
      for (let i = startIndex; i < endIndex; i++) {
        const item = renderItem(items[i], i)
        item.style.position = 'absolute'
        item.style.top = `${i * itemHeight}px`
        item.style.height = `${itemHeight}px`
        container.appendChild(item)
      }
    }
    
    container.addEventListener('scroll', () => {
      scrollTop = container.scrollTop
      requestAnimationFrame(render)
    })
    
    render()
  }
}

// 自动初始化
if (typeof window !== 'undefined') {
  window.mobileOptimization = new MobileOptimization()
  
  // 页面加载完成后优化启动时间
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MobileOptimization.optimizeStartupTime)
  } else {
    MobileOptimization.optimizeStartupTime()
  }
}

export default MobileOptimization

