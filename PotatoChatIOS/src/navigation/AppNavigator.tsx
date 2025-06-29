import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/Ionicons'

// 导入屏幕组件
import LoginScreen from '../screens/LoginScreen'
import HomeScreen from '../screens/HomeScreen'
import ChatScreen from '../screens/ChatScreen'
import TradingScreen from '../screens/TradingScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ChatDetailScreen from '../screens/ChatDetailScreen'
import TradingDetailScreen from '../screens/TradingDetailScreen'
import SettingsScreen from '../screens/SettingsScreen'

// 创建导航器
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// 主标签导航
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'Chat':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'
              break
            case 'Trading':
              iconName = focused ? 'trending-up' : 'trending-up-outline'
              break
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline'
              break
            default:
              iconName = 'circle'
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: '首页',
          headerTitle: '🥔 Potato Chat'
        }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          title: '聊天',
          headerTitle: '聊天'
        }} 
      />
      <Tab.Screen 
        name="Trading" 
        component={TradingScreen} 
        options={{ 
          title: '交易',
          headerTitle: '交易中心'
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: '我的',
          headerTitle: '个人中心'
        }} 
      />
    </Tab.Navigator>
  )
}

// 主堆栈导航
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6B35',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="ChatDetail" 
          component={ChatDetailScreen} 
          options={({ route }) => ({ 
            title: route.params?.chatName || '聊天详情',
            headerBackTitleVisible: false,
          })} 
        />
        <Stack.Screen 
          name="TradingDetail" 
          component={TradingDetailScreen} 
          options={({ route }) => ({ 
            title: route.params?.tradingPair || '交易详情',
            headerBackTitleVisible: false,
          })} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ 
            title: '设置',
            headerBackTitleVisible: false,
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

