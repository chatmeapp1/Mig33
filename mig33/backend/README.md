
# mig33 Backend API

Backend untuk aplikasi mig33 dengan fitur lengkap chat, social, dan payment.

## Fitur

1. **Authentication**
   - Register & Login dengan JWT
   - Password hashing dengan bcrypt

2. **User Profile**
   - Update nama, avatar, status
   - User search

3. **Friend System**
   - Friend requests
   - Accept/reject requests
   - Friend list

4. **Real-time Chat**
   - Private chat 1-on-1
   - Public chatrooms
   - Socket.IO untuk real-time messaging
   - Typing indicators

5. **Gift System**
   - Send virtual gifts
   - Gift catalog

6. **Credit System**
   - Topup credits
   - Transfer credits antar user
   - Transaction history

7. **Room Management**
   - Create/delete chatrooms
   - Ban/unban users
   - Moderator system

8. **Admin Panel**
   - User management
   - Platform statistics
   - Transaction monitoring

9. **Role System**
   - User, Merchant, Mentor, Admin roles

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables di `.env`

3. Jalankan server:
```bash
npm start
```

Server akan berjalan di http://0.0.0.0:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register user baru
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user
- POST /api/auth/logout - Logout

### Users
- GET /api/users/profile/:id - Get user profile
- PUT /api/users/profile - Update profile
- GET /api/users/search?q=query - Search users

### Friends
- GET /api/friends - Get friend list
- POST /api/friends/request/:userId - Send friend request
- POST /api/friends/accept/:userId - Accept friend request
- DELETE /api/friends/:userId - Remove friend
- GET /api/friends/requests - Get friend requests

### Chat
- GET /api/chat/private/:userId - Get private chat history
- POST /api/chat/private - Send private message
- GET /api/chat/conversations - Get all conversations

### Chatrooms
- GET /api/chatrooms - Get all public chatrooms
- POST /api/chatrooms - Create chatroom
- POST /api/chatrooms/:id/join - Join chatroom
- POST /api/chatrooms/:id/leave - Leave chatroom
- GET /api/chatrooms/:id/messages - Get chatroom messages

### Gifts
- GET /api/gifts - Get all gifts
- POST /api/gifts - Create gift (Admin)
- POST /api/gifts/send - Send gift to user

### Credits
- POST /api/credits/topup - Topup credits
- POST /api/credits/transfer - Transfer credits
- GET /api/credits/balance - Get balance
- GET /api/credits/history - Get transaction history

### Room Management
- PUT /api/rooms/:id - Update chatroom
- POST /api/rooms/:id/ban/:userId - Ban user
- POST /api/rooms/:id/unban/:userId - Unban user
- POST /api/rooms/:id/moderator/:userId - Add moderator
- DELETE /api/rooms/:id - Delete chatroom

### Admin
- GET /api/admin/users - Get all users
- PUT /api/admin/users/:id/role - Update user role
- DELETE /api/admin/users/:id - Delete user
- GET /api/admin/chatrooms - Get all chatrooms
- GET /api/admin/stats - Get platform statistics
- GET /api/admin/transactions - Get all transactions

## Socket.IO Events

### Client -> Server
- user-online - User connects
- join-chatroom - Join a chatroom
- leave-chatroom - Leave a chatroom
- chatroom-message - Send message to chatroom
- private-message - Send private message
- typing - User is typing
- stop-typing - User stopped typing

### Server -> Client
- friend-online - Friend came online
- friend-offline - Friend went offline
- chatroom-message - New chatroom message
- private-message - New private message
- private-message-sent - Private message sent confirmation
- user-typing - User is typing
- user-stop-typing - User stopped typing
