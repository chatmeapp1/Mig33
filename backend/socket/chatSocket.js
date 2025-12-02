
const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
  const users = new Map(); // userId -> socketId mapping

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins
    socket.on('user-online', async (userId) => {
      users.set(userId, socket.id);
      socket.userId = userId;

      // Update user status
      await User.findByIdAndUpdate(userId, { status: 'online' });

      // Notify friends
      const user = await User.findById(userId).populate('friends', '_id');
      user.friends.forEach(friend => {
        const friendSocketId = users.get(friend._id.toString());
        if (friendSocketId) {
          io.to(friendSocketId).emit('friend-online', { userId, status: 'online' });
        }
      });
    });

    // Join chatroom
    socket.on('join-chatroom', (chatroomId) => {
      socket.join(`chatroom-${chatroomId}`);
      console.log(`User ${socket.userId} joined chatroom ${chatroomId}`);
    });

    // Leave chatroom
    socket.on('leave-chatroom', (chatroomId) => {
      socket.leave(`chatroom-${chatroomId}`);
      console.log(`User ${socket.userId} left chatroom ${chatroomId}`);
    });

    // Send message to chatroom
    socket.on('chatroom-message', async (data) => {
      try {
        const { chatroomId, content, type } = data;

        const message = await Message.create({
          sender: socket.userId,
          chatroom: chatroomId,
          content,
          type: type || 'text',
          isPrivate: false
        });

        await message.populate('sender', 'username name avatar');
        if (message.gift) await message.populate('gift');

        io.to(`chatroom-${chatroomId}`).emit('chatroom-message', message);
      } catch (error) {
        console.error('Error sending chatroom message:', error);
      }
    });

    // Send private message
    socket.on('private-message', async (data) => {
      try {
        const { receiverId, content, type, giftId } = data;

        const message = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          content,
          type: type || 'text',
          gift: giftId,
          isPrivate: true
        });

        await message.populate('sender', 'username name avatar');
        await message.populate('receiver', 'username name avatar');
        if (giftId) await message.populate('gift');

        const receiverSocketId = users.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('private-message', message);
        }

        socket.emit('private-message-sent', message);
      } catch (error) {
        console.error('Error sending private message:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { receiverId, chatroomId } = data;

      if (receiverId) {
        const receiverSocketId = users.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('user-typing', { userId: socket.userId });
        }
      } else if (chatroomId) {
        socket.to(`chatroom-${chatroomId}`).emit('user-typing', { 
          userId: socket.userId, 
          chatroomId 
        });
      }
    });

    // Stop typing
    socket.on('stop-typing', (data) => {
      const { receiverId, chatroomId } = data;

      if (receiverId) {
        const receiverSocketId = users.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('user-stop-typing', { userId: socket.userId });
        }
      } else if (chatroomId) {
        socket.to(`chatroom-${chatroomId}`).emit('user-stop-typing', { 
          userId: socket.userId, 
          chatroomId 
        });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);

      if (socket.userId) {
        users.delete(socket.userId);

        // Update user status
        await User.findByIdAndUpdate(socket.userId, { status: 'offline' });

        // Notify friends
        const user = await User.findById(socket.userId).populate('friends', '_id');
        if (user) {
          user.friends.forEach(friend => {
            const friendSocketId = users.get(friend._id.toString());
            if (friendSocketId) {
              io.to(friendSocketId).emit('friend-offline', { 
                userId: socket.userId, 
                status: 'offline' 
              });
            }
          });
        }
      }
    });
  });
};
