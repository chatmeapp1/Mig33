
# API Endpoints Documentation

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

### Register
```
POST /api/auth/register
```
**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "name": "string (optional)"
}
```
**Response:**
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "role": "string",
    "credits": 100
  }
}
```

### Login
```
POST /api/auth/login
```
**Body:**
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
  "token": "JWT_TOKEN",
  "user": { ... }
}
```

### Get Current User
```
GET /api/auth/me
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

### Logout
```
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 User Profile

### Get User Profile
```
GET /api/users/profile/:id
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

### Update Profile
```
PUT /api/users/profile
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "name": "string (optional)",
  "avatar": "string (optional)",
  "status": "online|offline|away|busy (optional)"
}
```

### Search Users
```
GET /api/users/search?q=username
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "users": [...]
}
```

---

## 👥 Friends

### Get Friend List
```
GET /api/friends
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "friends": [...]
}
```

### Send Friend Request
```
POST /api/friends/request/:userId
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "message": "Friend request sent"
}
```

### Accept Friend Request
```
POST /api/friends/accept/:userId
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

### Remove Friend
```
DELETE /api/friends/:userId
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

### Get Friend Requests
```
GET /api/friends/requests
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "requests": [...]
}
```

---

## 💬 Chat (Private)

### Get Private Chat History
```
GET /api/chat/private/:userId
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "messages": [...]
}
```

### Send Private Message
```
POST /api/chat/private
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "receiver": "userId",
  "content": "string",
  "type": "text|image|gift (optional)",
  "giftId": "string (optional)"
}
```

### Get All Conversations
```
GET /api/chat/conversations
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "conversations": [...]
}
```

---

## 🏠 Chatrooms (Public)

### Get All Chatrooms
```
GET /api/chatrooms
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "chatrooms": [...]
}
```

### Get Chatroom Details
```
GET /api/chatrooms/:id
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

### Create Chatroom
```
POST /api/chatrooms
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "name": "string",
  "description": "string (optional)",
  "isPrivate": "boolean (optional)",
  "password": "string (optional)"
}
```

### Join Chatroom
```
POST /api/chatrooms/:id/join
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "password": "string (optional, if chatroom is private)"
}
```

### Leave Chatroom
```
POST /api/chatrooms/:id/leave
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

### Get Chatroom Messages
```
GET /api/chatrooms/:id/messages
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

### Send Message to Chatroom
```
POST /api/chatrooms/:id/messages
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "content": "string",
  "type": "text|image|gift (optional)"
}
```

---

## 🎁 Gifts

### Get All Gifts
```
GET /api/gifts
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "gifts": [...]
}
```

### Send Gift
```
POST /api/gifts/send
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "giftId": "string",
  "receiverId": "string"
}
```

---

## 💰 Credits

### Get Credit Balance
```
GET /api/credits/balance
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "credits": 1000
}
```

### Topup Credits
```
POST /api/credits/topup
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "amount": 100
}
```

### Transfer Credits
```
POST /api/credits/transfer
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "receiverId": "string",
  "amount": 50
}
```

### Get Transaction History
```
GET /api/credits/history
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "transactions": [...]
}
```

---

## 🏢 Room Management

### Get All Rooms
```
GET /api/rooms
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

### Create Room
```
POST /api/rooms
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "string (optional)",
  "maxUsers": "number (optional)"
}
```

### Update Room
```
PUT /api/rooms/:id
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

### Delete Room
```
DELETE /api/rooms/:id
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

### Get Room Details
```
GET /api/rooms/:id
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

---

## 🛡️ Admin Panel

### Get All Users (Admin)
```
GET /api/admin/users
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Role Required:** `admin`

### Ban User
```
POST /api/admin/users/:id/ban
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Role Required:** `admin`

### Unban User
```
POST /api/admin/users/:id/unban
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Role Required:** `admin`

### Update User Role
```
PUT /api/admin/users/:id/role
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "role": "user|merchant|mentor|admin"
}
```

**Role Required:** `admin`

### Get System Stats
```
GET /api/admin/stats
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Role Required:** `admin`

### Delete User
```
DELETE /api/admin/users/:id
```
**Headers:** `Authorization: Bearer JWT_TOKEN`

**Role Required:** `admin`

---

## 🔌 WebSocket Events (Socket.IO)

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'JWT_TOKEN'
  }
});
```

### Events to Emit:

**Join Room**
```javascript
socket.emit('join-room', { roomId: 'ROOM_ID' });
```

**Leave Room**
```javascript
socket.emit('leave-room', { roomId: 'ROOM_ID' });
```

**Send Room Message**
```javascript
socket.emit('room-message', {
  roomId: 'ROOM_ID',
  content: 'Message content'
});
```

**Send Private Message**
```javascript
socket.emit('private-message', {
  receiverId: 'USER_ID',
  content: 'Message content'
});
```

**Typing Indicator**
```javascript
socket.emit('typing', { roomId: 'ROOM_ID' });
socket.emit('stop-typing', { roomId: 'ROOM_ID' });
```

### Events to Listen:

**Room Message Received**
```javascript
socket.on('room-message', (message) => {
  console.log(message);
});
```

**Private Message Received**
```javascript
socket.on('private-message', (message) => {
  console.log(message);
});
```

**User Joined Room**
```javascript
socket.on('user-joined', (data) => {
  console.log(`${data.username} joined`);
});
```

**User Left Room**
```javascript
socket.on('user-left', (data) => {
  console.log(`${data.username} left`);
});
```

**Typing Indicator**
```javascript
socket.on('user-typing', (data) => {
  console.log(`${data.username} is typing...`);
});

socket.on('user-stop-typing', (data) => {
  console.log(`${data.username} stopped typing`);
});
```

---

## 📝 Notes

- Semua endpoint (kecuali `/auth/register` dan `/auth/login`) memerlukan JWT token di header `Authorization: Bearer JWT_TOKEN`
- Default credits untuk user baru: 100
- Role tersedia: `user`, `merchant`, `mentor`, `admin`
- Status user: `online`, `offline`, `away`, `busy`

