import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  isMe: boolean;
}

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '大家好！今天的市场表现如何？',
      sender: '投资达人',
      time: '10:30',
      isMe: false,
    },
    {
      id: '2',
      text: 'BTC今天涨了5%，看起来不错！',
      sender: '我',
      time: '10:32',
      isMe: true,
    },
    {
      id: '3',
      text: '是的，我也注意到了。ETH也在上涨。',
      sender: '加密专家',
      time: '10:35',
      isMe: false,
    },
    {
      id: '4',
      text: '大家觉得现在是入场的好时机吗？',
      sender: '新手小白',
      time: '10:40',
      isMe: false,
    },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: '我',
        time: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isMe: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View style={[
      styles.messageContainer,
      item.isMe ? styles.myMessage : styles.otherMessage
    ]}>
      {!item.isMe && (
        <Text style={styles.senderName}>{item.sender}</Text>
      )}
      <Text style={[
        styles.messageText,
        item.isMe ? styles.myMessageText : styles.otherMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  const chatRooms = [
    {id: '1', name: '投资交流群', lastMessage: '大家觉得现在是入场的好时机吗？', time: '10:40', unread: 3},
    {id: '2', name: 'BTC讨论组', lastMessage: 'BTC今天涨了5%，看起来不错！', time: '10:32', unread: 0},
    {id: '3', name: '新手学习群', lastMessage: '有什么好的学习资料推荐吗？', time: '09:15', unread: 1},
    {id: '4', name: 'AI助手', lastMessage: '您好，有什么可以帮助您的吗？', time: '昨天', unread: 0},
  ];

  return (
    <View style={styles.container}>
      {/* Chat Rooms List */}
      <ScrollView style={styles.chatRoomsList}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>聊天室</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
        
        {chatRooms.map((room) => (
          <TouchableOpacity key={room.id} style={styles.chatRoomItem}>
            <View style={styles.roomAvatar}>
              <Icon name="group" size={24} color="#FF6B35" />
            </View>
            <View style={styles.roomInfo}>
              <View style={styles.roomHeader}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomTime}>{room.time}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {room.lastMessage}
              </Text>
            </View>
            {room.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{room.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Active Chat */}
      <View style={styles.activeChatContainer}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>投资交流群</Text>
          <View style={styles.chatActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="videocam" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="call" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="more-vert" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="attach-file" size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="输入消息..."
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Icon name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatRoomsList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 5,
  },
  chatRoomItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  roomAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  roomInfo: {
    flex: 1,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roomTime: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeChatContainer: {
    flex: 2,
    backgroundColor: '#fff',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
  messagesList: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  messageText: {
    padding: 12,
    borderRadius: 18,
    fontSize: 14,
  },
  myMessageText: {
    backgroundColor: '#FF6B35',
    color: '#fff',
  },
  otherMessageText: {
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  attachButton: {
    marginRight: 10,
    padding: 5,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default ChatScreen;

