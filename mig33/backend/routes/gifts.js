
const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/gifts
// @desc    Get all gifts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const gifts = await Gift.find({ isActive: true });

    res.json({
      success: true,
      gifts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/gifts
// @desc    Create gift (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, image, price, category } = req.body;

    const gift = await Gift.create({
      name,
      description,
      image,
      price,
      category
    });

    res.status(201).json({
      success: true,
      gift
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/gifts/send
// @desc    Send gift to user
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    const { giftId, receiverId } = req.body;

    const gift = await Gift.findById(giftId);
    const receiver = await User.findById(receiverId);
    const sender = await User.findById(req.user.id);

    if (!gift || !receiver) {
      return res.status(404).json({ message: 'Gift or receiver not found' });
    }

    if (sender.credits < gift.price) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // Deduct credits from sender
    sender.credits -= gift.price;
    await sender.save();

    // Create transaction
    await Transaction.create({
      user: sender._id,
      type: 'gift',
      amount: gift.price,
      receiver: receiver._id,
      description: `Sent ${gift.name} to ${receiver.username}`
    });

    res.json({
      success: true,
      message: 'Gift sent successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
