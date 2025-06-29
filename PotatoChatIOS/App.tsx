import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { StatusBar } from 'react-native'
import { store, persistor } from './src/store/store'
import AppNavigator from './src/navigation/AppNavigator'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
        <AppNavigator />
      </PersistGate>
    </Provider>
  )
}

export default App

