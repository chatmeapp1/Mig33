
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Chatroom = require('../models/Chatroom');
const Transaction = require('../models/Transaction');
const Gift = require('../models/Gift');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);
    user.role = role;
    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/chatrooms
// @desc    Get all chatrooms
// @access  Private/Admin
router.get('/chatrooms', protect, authorize('admin'), async (req, res) => {
  try {
    const chatrooms = await Chatroom.find()
      .populate('owner', 'username name')
      .populate('members', 'username');

    res.json({
      success: true,
      count: chatrooms.length,
      chatrooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChatrooms = await Chatroom.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalGifts = await Gift.countDocuments();

    const onlineUsers = await User.countDocuments({ status: 'online' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalChatrooms,
        totalTransactions,
        totalGifts,
        onlineUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/transactions
// @desc    Get all transactions
// @access  Private/Admin
router.get('/transactions', protect, authorize('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'username email')
      .populate('receiver', 'username')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
