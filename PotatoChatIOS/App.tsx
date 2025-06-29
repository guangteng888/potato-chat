import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 导入屏幕组件
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import TradingScreen from './src/screens/TradingScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const App = (): JSX.Element => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Chat') {
              iconName = 'chat';
            } else if (route.name === 'Trading') {
              iconName = 'trending-up';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            } else {
              iconName = 'help';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#FF6B35',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{title: '主页'}}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{title: '聊天'}}
        />
        <Tab.Screen 
          name="Trading" 
          component={TradingScreen} 
          options={{title: '交易'}}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{title: '个人中心'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

