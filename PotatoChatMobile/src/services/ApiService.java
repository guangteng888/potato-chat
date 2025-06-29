package com.potatochat.mobile.services;

import android.content.Context;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONArray;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ApiService {
    private static final String TAG = "ApiService";
    private static final String BASE_URL = "https://api.potatochat.com/v1";
    private static ApiService instance;
    private ExecutorService executor;
    private Context context;

    private ApiService(Context context) {
        this.context = context;
        this.executor = Executors.newFixedThreadPool(4);
    }

    public static synchronized ApiService getInstance(Context context) {
        if (instance == null) {
            instance = new ApiService(context.getApplicationContext());
        }
        return instance;
    }

    public interface ApiCallback {
        void onSuccess(JSONObject response);
        void onError(String error);
    }

    public interface ApiArrayCallback {
        void onSuccess(JSONArray response);
        void onError(String error);
    }

    // 用户认证
    public void login(String username, String password, ApiCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject requestBody = new JSONObject();
                requestBody.put("username", username);
                requestBody.put("password", password);

                JSONObject response = makeRequest("POST", "/auth/login", requestBody);
                callback.onSuccess(response);
            } catch (Exception e) {
                Log.e(TAG, "Login error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    public void register(String username, String email, String password, ApiCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject requestBody = new JSONObject();
                requestBody.put("username", username);
                requestBody.put("email", email);
                requestBody.put("password", password);

                JSONObject response = makeRequest("POST", "/auth/register", requestBody);
                callback.onSuccess(response);
            } catch (Exception e) {
                Log.e(TAG, "Register error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    // 用户信息
    public void getUserProfile(String userId, ApiCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject response = makeRequest("GET", "/users/" + userId, null);
                callback.onSuccess(response);
            } catch (Exception e) {
                Log.e(TAG, "Get user profile error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    public void updateUserProfile(String userId, JSONObject profileData, ApiCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject response = makeRequest("PUT", "/users/" + userId, profileData);
                callback.onSuccess(response);
            } catch (Exception e) {
                Log.e(TAG, "Update user profile error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    // 聊天功能
    public void getChatRooms(String userId, ApiArrayCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject response = makeRequest("GET", "/chat/rooms?userId=" + userId, null);
                JSONArray rooms = response.getJSONArray("data");
                callback.onSuccess(rooms);
            } catch (Exception e) {
                Log.e(TAG, "Get chat rooms error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    public void getChatMessages(String roomId, int page, int limit, ApiArrayCallback callback) {
        executor.execute(() -> {
            try {
                String endpoint = String.format("/chat/rooms/%s/messages?page=%d&limit=%d", 
                    roomId, page, limit);
                JSONObject response = makeRequest("GET", endpoint, null);
                JSONArray messages = response.getJSONArray("data");
                callback.onSuccess(messages);
            } catch (Exception e) {
                Log.e(TAG, "Get chat messages error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    public void sendMessage(String roomId, String content, String type, ApiCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject requestBody = new JSONObject();
                requestBody.put("content", content);
                requestBody.put("type", type);

                JSONObject response = makeRequest("POST", "/chat/rooms/" + roomId + "/messages", requestBody);
                callback.onSuccess(response);
            } catch (Exception e) {
                Log.e(TAG, "Send message error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    // 交易功能
    public void getTradingPairs(ApiArrayCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject response = makeRequest("GET", "/trading/pairs", null);
                JSONArray pairs = response.getJSONArray("data");
                callback.onSuccess(pairs);
            } catch (Exception e) {
                Log.e(TAG, "Get trading pairs error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    public void getMarketData(String symbol, ApiCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject response = makeRequest("GET", "/trading/market/" + symbol, null);
                callback.onSuccess(response);
            } catch (Exception e) {
                Log.e(TAG, "Get market data error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    public void placeTrade(String symbol, String type, double amount, double price, ApiCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject requestBody = new JSONObject();
                requestBody.put("symbol", symbol);
                requestBody.put("type", type);
                requestBody.put("amount", amount);
                requestBody.put("price", price);

                JSONObject response = makeRequest("POST", "/trading/orders", requestBody);
                callback.onSuccess(response);
            } catch (Exception e) {
                Log.e(TAG, "Place trade error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    public void getUserPortfolio(String userId, ApiCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject response = makeRequest("GET", "/trading/portfolio/" + userId, null);
                callback.onSuccess(response);
            } catch (Exception e) {
                Log.e(TAG, "Get user portfolio error", e);
                callback.onError(e.getMessage());
            }
        });
    }

    // 通用HTTP请求方法
    private JSONObject makeRequest(String method, String endpoint, JSONObject requestBody) throws Exception {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        
        connection.setRequestMethod(method);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");
        
        // 添加认证头
        String token = getAuthToken();
        if (token != null && !token.isEmpty()) {
            connection.setRequestProperty("Authorization", "Bearer " + token);
        }

        // 发送请求体
        if (requestBody != null && ("POST".equals(method) || "PUT".equals(method))) {
            connection.setDoOutput(true);
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = requestBody.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }
        }

        // 读取响应
        int responseCode = connection.getResponseCode();
        BufferedReader reader;
        
        if (responseCode >= 200 && responseCode < 300) {
            reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        } else {
            reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
        }

        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        reader.close();

        JSONObject jsonResponse = new JSONObject(response.toString());
        
        if (responseCode >= 200 && responseCode < 300) {
            return jsonResponse;
        } else {
            throw new Exception("HTTP " + responseCode + ": " + jsonResponse.optString("message", "Unknown error"));
        }
    }

    // 获取认证令牌
    private String getAuthToken() {
        // 从SharedPreferences或其他安全存储中获取token
        return context.getSharedPreferences("auth", Context.MODE_PRIVATE)
                .getString("access_token", null);
    }

    // 保存认证令牌
    public void saveAuthToken(String token) {
        context.getSharedPreferences("auth", Context.MODE_PRIVATE)
                .edit()
                .putString("access_token", token)
                .apply();
    }

    // 清除认证令牌
    public void clearAuthToken() {
        context.getSharedPreferences("auth", Context.MODE_PRIVATE)
                .edit()
                .remove("access_token")
                .apply();
    }

    // 检查是否已登录
    public boolean isLoggedIn() {
        String token = getAuthToken();
        return token != null && !token.isEmpty();
    }

    // 关闭服务
    public void shutdown() {
        if (executor != null && !executor.isShutdown()) {
            executor.shutdown();
        }
    }
}

