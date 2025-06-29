package com.potatochat.mobile.utils;

import android.util.Log;
import org.json.JSONObject;
import java.net.URI;
import java.util.concurrent.TimeUnit;
import java.util.ArrayList;
import java.util.List;

public class WebSocketManager {
    private static final String TAG = "WebSocketManager";
    private static final String WS_URL = "wss://ws.potatochat.com/v1";
    private static WebSocketManager instance;
    
    private WebSocketClient webSocket;
    private boolean isConnected = false;
    private boolean shouldReconnect = true;
    private int reconnectAttempts = 0;
    private static final int MAX_RECONNECT_ATTEMPTS = 5;
    private static final long RECONNECT_DELAY = 3000; // 3秒
    
    private List<WebSocketListener> listeners = new ArrayList<>();

    public interface WebSocketListener {
        void onConnected();
        void onDisconnected();
        void onMessage(JSONObject message);
        void onError(String error);
    }

    private WebSocketManager() {
        // 私有构造函数
    }

    public static synchronized WebSocketManager getInstance() {
        if (instance == null) {
            instance = new WebSocketManager();
        }
        return instance;
    }

    public void addListener(WebSocketListener listener) {
        if (!listeners.contains(listener)) {
            listeners.add(listener);
        }
    }

    public void removeListener(WebSocketListener listener) {
        listeners.remove(listener);
    }

    public void connect(String authToken) {
        if (isConnected) {
            Log.d(TAG, "WebSocket already connected");
            return;
        }

        try {
            URI uri = URI.create(WS_URL + "?token=" + authToken);
            webSocket = new WebSocketClient(uri) {
                @Override
                public void onOpen() {
                    Log.d(TAG, "WebSocket connected");
                    isConnected = true;
                    reconnectAttempts = 0;
                    
                    // 发送心跳
                    startHeartbeat();
                    
                    // 通知监听器
                    for (WebSocketListener listener : listeners) {
                        listener.onConnected();
                    }
                }

                @Override
                public void onMessage(String message) {
                    Log.d(TAG, "WebSocket message received: " + message);
                    try {
                        JSONObject jsonMessage = new JSONObject(message);
                        
                        // 处理不同类型的消息
                        String type = jsonMessage.optString("type");
                        switch (type) {
                            case "chat_message":
                                handleChatMessage(jsonMessage);
                                break;
                            case "trading_update":
                                handleTradingUpdate(jsonMessage);
                                break;
                            case "user_status":
                                handleUserStatus(jsonMessage);
                                break;
                            case "system_notification":
                                handleSystemNotification(jsonMessage);
                                break;
                            default:
                                // 通知所有监听器
                                for (WebSocketListener listener : listeners) {
                                    listener.onMessage(jsonMessage);
                                }
                                break;
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing WebSocket message", e);
                    }
                }

                @Override
                public void onClose(int code, String reason) {
                    Log.d(TAG, "WebSocket closed: " + code + " - " + reason);
                    isConnected = false;
                    stopHeartbeat();
                    
                    // 通知监听器
                    for (WebSocketListener listener : listeners) {
                        listener.onDisconnected();
                    }
                    
                    // 尝试重连
                    if (shouldReconnect && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                        scheduleReconnect(authToken);
                    }
                }

                @Override
                public void onError(Exception ex) {
                    Log.e(TAG, "WebSocket error", ex);
                    
                    // 通知监听器
                    for (WebSocketListener listener : listeners) {
                        listener.onError(ex.getMessage());
                    }
                }
            };

            webSocket.connect();
            
        } catch (Exception e) {
            Log.e(TAG, "Failed to connect WebSocket", e);
            for (WebSocketListener listener : listeners) {
                listener.onError(e.getMessage());
            }
        }
    }

    public void disconnect() {
        shouldReconnect = false;
        stopHeartbeat();
        
        if (webSocket != null) {
            webSocket.close();
            webSocket = null;
        }
        
        isConnected = false;
    }

    public void sendMessage(JSONObject message) {
        if (isConnected && webSocket != null) {
            try {
                webSocket.send(message.toString());
                Log.d(TAG, "Message sent: " + message.toString());
            } catch (Exception e) {
                Log.e(TAG, "Failed to send message", e);
            }
        } else {
            Log.w(TAG, "WebSocket not connected, message not sent");
        }
    }

    // 发送聊天消息
    public void sendChatMessage(String roomId, String content, String type) {
        try {
            JSONObject message = new JSONObject();
            message.put("type", "chat_message");
            message.put("roomId", roomId);
            message.put("content", content);
            message.put("messageType", type);
            message.put("timestamp", System.currentTimeMillis());
            
            sendMessage(message);
        } catch (Exception e) {
            Log.e(TAG, "Failed to create chat message", e);
        }
    }

    // 发送交易订单
    public void sendTradingOrder(String symbol, String orderType, double amount, double price) {
        try {
            JSONObject message = new JSONObject();
            message.put("type", "trading_order");
            message.put("symbol", symbol);
            message.put("orderType", orderType);
            message.put("amount", amount);
            message.put("price", price);
            message.put("timestamp", System.currentTimeMillis());
            
            sendMessage(message);
        } catch (Exception e) {
            Log.e(TAG, "Failed to create trading order", e);
        }
    }

    // 订阅价格更新
    public void subscribePriceUpdates(String[] symbols) {
        try {
            JSONObject message = new JSONObject();
            message.put("type", "subscribe_prices");
            message.put("symbols", new JSONArray(symbols));
            
            sendMessage(message);
        } catch (Exception e) {
            Log.e(TAG, "Failed to subscribe price updates", e);
        }
    }

    // 处理聊天消息
    private void handleChatMessage(JSONObject message) {
        Log.d(TAG, "Handling chat message: " + message.toString());
        
        // 通知监听器
        for (WebSocketListener listener : listeners) {
            listener.onMessage(message);
        }
    }

    // 处理交易更新
    private void handleTradingUpdate(JSONObject message) {
        Log.d(TAG, "Handling trading update: " + message.toString());
        
        // 通知监听器
        for (WebSocketListener listener : listeners) {
            listener.onMessage(message);
        }
    }

    // 处理用户状态
    private void handleUserStatus(JSONObject message) {
        Log.d(TAG, "Handling user status: " + message.toString());
        
        // 通知监听器
        for (WebSocketListener listener : listeners) {
            listener.onMessage(message);
        }
    }

    // 处理系统通知
    private void handleSystemNotification(JSONObject message) {
        Log.d(TAG, "Handling system notification: " + message.toString());
        
        // 通知监听器
        for (WebSocketListener listener : listeners) {
            listener.onMessage(message);
        }
    }

    // 心跳机制
    private Runnable heartbeatRunnable;
    private Thread heartbeatThread;

    private void startHeartbeat() {
        stopHeartbeat();
        
        heartbeatRunnable = new Runnable() {
            @Override
            public void run() {
                while (isConnected && !Thread.currentThread().isInterrupted()) {
                    try {
                        JSONObject ping = new JSONObject();
                        ping.put("type", "ping");
                        ping.put("timestamp", System.currentTimeMillis());
                        sendMessage(ping);
                        
                        Thread.sleep(30000); // 30秒心跳
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    } catch (Exception e) {
                        Log.e(TAG, "Heartbeat error", e);
                        break;
                    }
                }
            }
        };
        
        heartbeatThread = new Thread(heartbeatRunnable);
        heartbeatThread.start();
    }

    private void stopHeartbeat() {
        if (heartbeatThread != null && heartbeatThread.isAlive()) {
            heartbeatThread.interrupt();
            heartbeatThread = null;
        }
    }

    // 重连机制
    private void scheduleReconnect(String authToken) {
        reconnectAttempts++;
        Log.d(TAG, "Scheduling reconnect attempt " + reconnectAttempts);
        
        new Thread(() -> {
            try {
                Thread.sleep(RECONNECT_DELAY * reconnectAttempts);
                if (shouldReconnect) {
                    connect(authToken);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

    public boolean isConnected() {
        return isConnected;
    }

    public int getReconnectAttempts() {
        return reconnectAttempts;
    }

    // 清理资源
    public void cleanup() {
        shouldReconnect = false;
        disconnect();
        listeners.clear();
    }
}

