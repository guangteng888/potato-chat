import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/potato_chat'
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    await mongoose.connect(mongoUri, options)
    
    console.log(`✅ MongoDB 连接成功: ${mongoose.connection.host}`)
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB 连接错误:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB 连接断开')
    })
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB 重新连接成功')
    })
    
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error)
    process.exit(1)
  }
}

export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close()
    console.log('✅ MongoDB 连接已关闭')
  } catch (error) {
    console.error('❌ 关闭 MongoDB 连接时出错:', error)
  }
}

