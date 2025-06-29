# Potato Chat API Documentation

## 🚀 API Overview

The Potato Chat API provides a comprehensive RESTful interface for all client applications. The API is built with Node.js, Express, and MongoDB, offering secure and scalable endpoints for user management, chat functionality, trading operations, and administrative tasks.

**Base URL:** `https://api.potatochat.com/v1`
**WebSocket URL:** `wss://ws.potatochat.com`

## 🔐 Authentication

### JWT Token Authentication

All API endpoints (except public ones) require authentication using JWT tokens.

#### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Token Refresh
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

## 📚 API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "profile": {
        "firstName": "string",
        "lastName": "string"
      }
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```

#### POST /auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "profile": {
        "firstName": "string",
        "lastName": "string",
        "avatar": "string"
      }
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "string"
}
```

#### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

### User Management Endpoints

#### GET /users/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "profile": {
      "firstName": "string",
      "lastName": "string",
      "avatar": "string",
      "bio": "string"
    },
    "settings": {
      "theme": "string",
      "notifications": "boolean",
      "privacy": "object"
    }
  }
}
```

#### PUT /users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "profile": {
    "firstName": "string",
    "lastName": "string",
    "bio": "string"
  }
}
```

#### POST /users/avatar
Upload user avatar.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:** Form data with `avatar` file field

#### GET /users/search
Search users by username or email.

**Query Parameters:**
- `q`: Search query string
- `limit`: Number of results (default: 10)
- `offset`: Pagination offset (default: 0)

### Chat Endpoints

#### GET /chat/rooms
Get user's chat rooms.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of rooms (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": "string",
        "name": "string",
        "type": "direct|group",
        "participants": ["string"],
        "lastMessage": {
          "content": "string",
          "timestamp": "string",
          "sender": "string"
        },
        "unreadCount": "number"
      }
    ],
    "total": "number"
  }
}
```

#### POST /chat/rooms
Create a new chat room.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "type": "direct|group",
  "participants": ["string"]
}
```

#### GET /chat/rooms/:roomId/messages
Get messages from a chat room.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: Number of messages (default: 50)
- `before`: Message ID for pagination
- `after`: Message ID for pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "string",
        "content": "string",
        "type": "text|image|file",
        "sender": {
          "id": "string",
          "username": "string",
          "avatar": "string"
        },
        "timestamp": "string",
        "edited": "boolean",
        "metadata": "object"
      }
    ],
    "hasMore": "boolean"
  }
}
```

#### POST /chat/rooms/:roomId/messages
Send a message to a chat room.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "string",
  "type": "text|image|file",
  "metadata": "object"
}
```

#### PUT /chat/messages/:messageId
Edit a message.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "string"
}
```

#### DELETE /chat/messages/:messageId
Delete a message.

**Headers:** `Authorization: Bearer <token>`

### Trading Endpoints

#### GET /trading/portfolio
Get user's trading portfolio.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalValue": "number",
    "totalGain": "number",
    "totalGainPercent": "number",
    "positions": [
      {
        "symbol": "string",
        "quantity": "number",
        "averagePrice": "number",
        "currentPrice": "number",
        "gain": "number",
        "gainPercent": "number"
      }
    ]
  }
}
```

#### GET /trading/market-data
Get market data for symbols.

**Query Parameters:**
- `symbols`: Comma-separated list of symbols
- `interval`: Data interval (1m, 5m, 1h, 1d)

**Response:**
```json
{
  "success": true,
  "data": {
    "AAPL": {
      "symbol": "AAPL",
      "price": "number",
      "change": "number",
      "changePercent": "number",
      "volume": "number",
      "timestamp": "string"
    }
  }
}
```

#### POST /trading/orders
Place a trading order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "symbol": "string",
  "type": "buy|sell",
  "orderType": "market|limit",
  "quantity": "number",
  "price": "number"
}
```

#### GET /trading/orders
Get user's trading orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status`: Order status filter
- `limit`: Number of orders
- `offset`: Pagination offset

#### DELETE /trading/orders/:orderId
Cancel a trading order.

**Headers:** `Authorization: Bearer <token>`

### Admin Endpoints

#### GET /admin/users
Get all users (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page`: Page number
- `limit`: Users per page
- `search`: Search query
- `status`: User status filter

#### PUT /admin/users/:userId/status
Update user status (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "active|suspended|banned"
}
```

#### GET /admin/analytics
Get system analytics (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": "number",
      "active": "number",
      "newToday": "number"
    },
    "messages": {
      "total": "number",
      "today": "number"
    },
    "trades": {
      "total": "number",
      "volume": "number",
      "today": "number"
    }
  }
}
```

## 🔌 WebSocket API

### Connection

Connect to WebSocket server with JWT token:

```javascript
const ws = new WebSocket('wss://ws.potatochat.com?token=your_jwt_token')
```

### Event Types

#### Client to Server Events

**join_room**
```json
{
  "type": "join_room",
  "data": {
    "roomId": "string"
  }
}
```

**leave_room**
```json
{
  "type": "leave_room",
  "data": {
    "roomId": "string"
  }
}
```

**send_message**
```json
{
  "type": "send_message",
  "data": {
    "roomId": "string",
    "content": "string",
    "type": "text|image|file"
  }
}
```

**typing_start**
```json
{
  "type": "typing_start",
  "data": {
    "roomId": "string"
  }
}
```

**typing_stop**
```json
{
  "type": "typing_stop",
  "data": {
    "roomId": "string"
  }
}
```

#### Server to Client Events

**message_received**
```json
{
  "type": "message_received",
  "data": {
    "roomId": "string",
    "message": {
      "id": "string",
      "content": "string",
      "sender": "object",
      "timestamp": "string"
    }
  }
}
```

**user_typing**
```json
{
  "type": "user_typing",
  "data": {
    "roomId": "string",
    "userId": "string",
    "username": "string"
  }
}
```

**market_update**
```json
{
  "type": "market_update",
  "data": {
    "symbol": "string",
    "price": "number",
    "change": "number",
    "timestamp": "string"
  }
}
```

**notification**
```json
{
  "type": "notification",
  "data": {
    "title": "string",
    "message": "string",
    "type": "info|success|warning|error"
  }
}
```

## 📝 Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid login credentials |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

## 🔒 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **WebSocket connections**: 10 connections per user
- **File uploads**: 10 uploads per hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📊 Pagination

List endpoints support pagination using offset-based pagination:

**Query Parameters:**
- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "items": ["array"],
    "pagination": {
      "total": "number",
      "limit": "number",
      "offset": "number",
      "hasMore": "boolean"
    }
  }
}
```

## 🔍 Filtering and Sorting

Many endpoints support filtering and sorting:

**Query Parameters:**
- `sort`: Sort field (e.g., `createdAt`, `-createdAt` for descending)
- `filter[field]`: Filter by field value
- `search`: Full-text search query

**Example:**
```
GET /users?sort=-createdAt&filter[status]=active&search=john
```

## 📱 Mobile-Specific Endpoints

### Push Notifications

#### POST /mobile/register-device
Register device for push notifications.

**Request Body:**
```json
{
  "deviceToken": "string",
  "platform": "ios|android"
}
```

#### DELETE /mobile/unregister-device
Unregister device from push notifications.

## 🧪 Testing

### API Testing

Use the following tools for API testing:

- **Postman Collection**: Available in `/docs/postman/`
- **OpenAPI Spec**: Available at `/api/docs`
- **Test Environment**: `https://api-staging.potatochat.com/v1`

### Authentication for Testing

```bash
# Get test token
curl -X POST https://api-staging.potatochat.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

## 📚 SDK and Libraries

### JavaScript/TypeScript SDK

```bash
npm install @potatochat/api-client
```

```javascript
import { PotatoChatAPI } from '@potatochat/api-client'

const api = new PotatoChatAPI({
  baseURL: 'https://api.potatochat.com/v1',
  token: 'your_jwt_token'
})

// Get user profile
const profile = await api.users.getProfile()

// Send message
await api.chat.sendMessage('room_id', {
  content: 'Hello, world!',
  type: 'text'
})
```

### React Hooks

```javascript
import { usePotatoChat } from '@potatochat/react-hooks'

function ChatComponent() {
  const { messages, sendMessage, loading } = usePotatoChat('room_id')
  
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>{message.content}</div>
      ))}
    </div>
  )
}
```

## 🔄 Versioning

The API uses semantic versioning:

- **Major version**: Breaking changes
- **Minor version**: New features (backward compatible)
- **Patch version**: Bug fixes

Current version: `v1.0.0`

### Version Headers

```http
API-Version: 1.0.0
Accept-Version: ~1.0
```

## 📞 Support

For API support and questions:

- **Documentation**: https://docs.potatochat.com
- **GitHub Issues**: https://github.com/guangteng888/potato-chat/issues
- **Email**: api-support@potatochat.com

---

This API documentation is automatically generated and updated. For the most current version, visit our [online documentation](https://docs.potatochat.com).

