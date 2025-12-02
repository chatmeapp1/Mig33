
const express = require('express');
const router = express.Router();
const Chatroom = require('../models/Chatroom');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @route   GET /api/chatrooms
// @desc    Get all public chatrooms
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const chatrooms = await Chatroom.find({ type: 'public', isActive: true })
      .populate('owner', 'username name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      chatrooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chatrooms
// @desc    Create chatroom
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, type, maxMembers } = req.body;

    const chatroom = await Chatroom.create({
      name,
      description,
      type: type || 'public',
      owner: req.user.id,
      members: [req.user.id],
      moderators: [req.user.id],
      maxMembers: maxMembers || 100
    });

    await chatroom.populate('owner', 'username name avatar');

    res.status(201).json({
      success: true,
      chatroom
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chatrooms/:id/join
// @desc    Join chatroom
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id);

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    if (chatroom.bannedUsers.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are banned from this chatroom' });
    }

    if (chatroom.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    if (chatroom.members.length >= chatroom.maxMembers) {
      return res.status(400).json({ message: 'Chatroom is full' });
    }

    chatroom.members.push(req.user.id);
    await chatroom.save();

    res.json({
      success: true,
      message: 'Joined chatroom successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chatrooms/:id/leave
// @desc    Leave chatroom
// @access  Private
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id);

    chatroom.members = chatroom.members.filter(m => m.toString() !== req.user.id.toString());
    await chatroom.save();

    res.json({
      success: true,
      message: 'Left chatroom successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/chatrooms/:id/messages
// @desc    Get chatroom messages
// @access  Private
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ chatroom: req.params.id })
      .populate('sender', 'username name avatar')
      .populate('gift')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
