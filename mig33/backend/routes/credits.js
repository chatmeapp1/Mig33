
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @route   POST /api/credits/topup
// @desc    Topup credits
// @access  Private
router.post('/topup', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);
    user.credits += amount;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: 'topup',
      amount,
      description: `Topup ${amount} credits`
    });

    res.json({
      success: true,
      credits: user.credits,
      message: 'Credits added successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/credits/transfer
// @desc    Transfer credits to another user
// @access  Private
router.post('/transfer', protect, async (req, res) => {
  try {
    const { receiverId, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    if (sender.credits < amount) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    sender.credits -= amount;
    receiver.credits += amount;

    await sender.save();
    await receiver.save();

    await Transaction.create({
      user: sender._id,
      type: 'transfer',
      amount,
      receiver: receiver._id,
      description: `Transfer ${amount} credits to ${receiver.username}`
    });

    res.json({
      success: true,
      credits: sender.credits,
      message: 'Credits transferred successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/credits/balance
// @desc    Get credit balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      credits: user.credits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/credits/history
// @desc    Get transaction history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('receiver', 'username name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
