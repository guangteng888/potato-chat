import {configureStore} from '@reduxjs/toolkit';

// 创建基础的store配置
export const store = configureStore({
  reducer: {
    // 这里可以添加各种reducer
    // auth: authSlice.reducer,
    // chat: chatSlice.reducer,
    // trading: tradingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

