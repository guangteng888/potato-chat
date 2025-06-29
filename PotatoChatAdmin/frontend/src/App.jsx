import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ApiManagement from './pages/ApiManagement';
import TradingRecords from './pages/TradingRecords';
import AppReview from './pages/AppReview';
import BusinessManagement from './pages/BusinessManagement';

// 简单的认证检查
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 登录页面 */}
          <Route path="/login" element={<Login />} />
          
          {/* 受保护的路由 */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* 默认重定向到仪表板 */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* 数据仪表板 */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* 用户管理 */}
            <Route path="users" element={<UserManagement />} />
            
            {/* API管理 */}
            <Route path="api-management" element={<ApiManagement />} />
            
            {/* 交易记录管理 */}
            <Route path="trading-records" element={<TradingRecords />} />
            
            {/* 应用审核管理 */}
            <Route path="app-review" element={<AppReview />} />
            
            {/* 商业模式管理 */}
            <Route path="business-management" element={<BusinessManagement />} />
          </Route>
          
          {/* 404页面 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">页面未找到</p>
                <a 
                  href="/" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  返回首页
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

