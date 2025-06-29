import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { chatActions, selectMessages, selectUser } from '../store/store'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file'
}

interface ChatDetailScreenProps {
  navigation: any
  route: any
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ navigation, route }) => {
  const { roomId, chatName } = route.params
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  
  const dispatch = useDispatch()
  const messages = useSelector(selectMessages(roomId))
  const currentUser = useSelector(selectUser)

  useEffect(() => {
    // 设置当前活跃房间
    dispatch(chatActions.setActiveRoom(roomId))
    
    // 加载历史消息
    loadMessages()
    
    return () => {
      dispatch(chatActions.setActiveRoom(null))
    }
  }, [roomId])

  const loadMessages = () => {
    // 模拟加载历史消息
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user1',
        senderName: '张三',
        content: '大家好！今天BTC的走势怎么样？',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text',
      },
      {
        id: '2',
        senderId: 'user2',
        senderName: '李四',
        content: '看起来有上涨趋势，建议关注支撑位',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        type: 'text',
      },
      {
        id: '3',
        senderId: currentUser?.id || 'current',
        senderName: currentUser?.username || '我',
        content: '谢谢分享！我也在关注这个',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: 'text',
      },
    ]
    
    dispatch(chatActions.setMessages({ roomId, messages: mockMessages }))
  }

  const sendMessage = () => {
    if (!inputText.trim() || !currentUser) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.username,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    }
    
    dispatch(chatActions.addMessage({ roomId, message: newMessage }))
    setInputText('')
    
    // 滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return '刚刚'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}小时前`
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUser?.id
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {!isCurrentUser && (
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{item.senderName}</Text>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.content}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    )
  }

  const handleMoreOptions = () => {
    Alert.alert(
      '更多选项',
      '选择操作',
      [
        { text: '群组信息', onPress: () => console.log('群组信息') },
        { text: '清空聊天记录', onPress: () => console.log('清空聊天记录') },
        { text: '举报', onPress: () => console.log('举报') },
        { text: '取消', style: 'cancel' },
      ]
    )
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* 自定义导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{chatName}</Text>
          <Text style={styles.headerSubtitle}>
            {isTyping ? '正在输入...' : '在线'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={handleMoreOptions}
        >
          <Icon name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 消息列表 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* 输入区域 */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="add" size={24} color="#8E8E93" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="输入消息..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={inputText.trim() ? "#FFFFFF" : "#8E8E93"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  moreButton: {
    padding: 5,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  messagesContainer: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  senderInfo: {
    marginBottom: 5,
  },
  senderName: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  currentUserBubble: {
    backgroundColor: '#FF6B35',
  },
  otherUserBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#1C1C1E',
  },
  messageTime: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 5,
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  attachButton: {
    padding: 8,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#FF6B35',
  },
  sendButtonInactive: {
    backgroundColor: '#F2F2F7',
  },
})

export default ChatDetailScreen

