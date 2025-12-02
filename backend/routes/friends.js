
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/friends
// @desc    Get friend list
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', '-password');

    res.json({
      success: true,
      friends: user.friends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/friends/request/:userId
// @desc    Send friend request
// @access  Private
router.post('/request/:userId', protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends
    if (targetUser.friends.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Check if request already sent
    const requestExists = targetUser.friendRequests.some(
      req => req.from.toString() === req.user.id.toString()
    );

    if (requestExists) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    targetUser.friendRequests.push({ from: req.user.id });
    await targetUser.save();

    res.json({
      success: true,
      message: 'Friend request sent'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/friends/accept/:requestId
// @desc    Accept friend request
// @access  Private
router.post('/accept/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const requester = await User.findById(req.params.userId);

    if (!requester) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from friend requests
    user.friendRequests = user.friendRequests.filter(
      req => req.from.toString() !== req.params.userId
    );

    // Add to friends
    user.friends.push(requester._id);
    requester.friends.push(user._id);

    await user.save();
    await requester.save();

    res.json({
      success: true,
      message: 'Friend request accepted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/friends/:userId
// @desc    Remove friend
// @access  Private
router.delete('/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.userId);

    user.friends = user.friends.filter(f => f.toString() !== req.params.userId);
    friend.friends = friend.friends.filter(f => f.toString() !== req.user.id.toString());

    await user.save();
    await friend.save();

    res.json({
      success: true,
      message: 'Friend removed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/friends/requests
// @desc    Get friend requests
// @access  Private
router.get('/requests', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friendRequests.from', '-password');

    res.json({
      success: true,
      requests: user.friendRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
