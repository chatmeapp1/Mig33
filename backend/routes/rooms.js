
const express = require('express');
const router = express.Router();
const Chatroom = require('../models/Chatroom');
const { protect } = require('../middleware/auth');

// @route   PUT /api/rooms/:id
// @desc    Update chatroom
// @access  Private (Owner/Moderator)
router.put('/:id', protect, async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id);

    if (!chatroom) {
      return res.status(404).json({ message: 'Chatroom not found' });
    }

    const isOwner = chatroom.owner.toString() === req.user.id.toString();
    const isModerator = chatroom.moderators.some(m => m.toString() === req.user.id.toString());

    if (!isOwner && !isModerator) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, maxMembers } = req.body;

    if (name) chatroom.name = name;
    if (description) chatroom.description = description;
    if (maxMembers) chatroom.maxMembers = maxMembers;

    await chatroom.save();

    res.json({
      success: true,
      chatroom
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/rooms/:id/ban/:userId
// @desc    Ban user from chatroom
// @access  Private (Owner/Moderator)
router.post('/:id/ban/:userId', protect, async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id);

    const isOwner = chatroom.owner.toString() === req.user.id.toString();
    const isModerator = chatroom.moderators.some(m => m.toString() === req.user.id.toString());

    if (!isOwner && !isModerator) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!chatroom.bannedUsers.includes(req.params.userId)) {
      chatroom.bannedUsers.push(req.params.userId);
      chatroom.members = chatroom.members.filter(m => m.toString() !== req.params.userId);
      await chatroom.save();
    }

    res.json({
      success: true,
      message: 'User banned successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/rooms/:id/unban/:userId
// @desc    Unban user from chatroom
// @access  Private (Owner/Moderator)
router.post('/:id/unban/:userId', protect, async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id);

    const isOwner = chatroom.owner.toString() === req.user.id.toString();
    const isModerator = chatroom.moderators.some(m => m.toString() === req.user.id.toString());

    if (!isOwner && !isModerator) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    chatroom.bannedUsers = chatroom.bannedUsers.filter(u => u.toString() !== req.params.userId);
    await chatroom.save();

    res.json({
      success: true,
      message: 'User unbanned successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/rooms/:id/moderator/:userId
// @desc    Add moderator
// @access  Private (Owner only)
router.post('/:id/moderator/:userId', protect, async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id);

    if (chatroom.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Only owner can add moderators' });
    }

    if (!chatroom.moderators.includes(req.params.userId)) {
      chatroom.moderators.push(req.params.userId);
      await chatroom.save();
    }

    res.json({
      success: true,
      message: 'Moderator added successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete chatroom
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id);

    if (chatroom.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Only owner can delete chatroom' });
    }

    await chatroom.deleteOne();

    res.json({
      success: true,
      message: 'Chatroom deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
