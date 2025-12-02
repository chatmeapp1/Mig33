
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/chat/private/:userId
// @desc    Get private chat history
// @access  Private
router.get('/private/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ],
      isPrivate: true
    })
    .populate('sender', 'username name avatar')
    .populate('receiver', 'username name avatar')
    .populate('gift')
    .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chat/private
// @desc    Send private message
// @access  Private
router.post('/private', protect, async (req, res) => {
  try {
    const { receiver, content, type, giftId } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      content,
      type: type || 'text',
      gift: giftId,
      isPrivate: true
    });

    await message.populate('sender', 'username name avatar');
    await message.populate('receiver', 'username name avatar');
    if (giftId) await message.populate('gift');

    // Emit socket event
    const io = req.app.get('io');
    io.to(receiver).emit('private-message', message);

    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/chat/conversations
// @desc    Get all conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ],
          isPrivate: true
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    await User.populate(messages, { path: '_id', select: 'username name avatar status' });
    await Message.populate(messages, { path: 'lastMessage.sender lastMessage.receiver', select: 'username name avatar' });

    res.json({
      success: true,
      conversations: messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
