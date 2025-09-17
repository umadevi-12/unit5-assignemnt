const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const Content = require('../models/Content');
const User = require('../models/User');

const router = express.Router();

// GET /content/free - all users can view free content (no auth required)
router.get('/free', async (req, res, next) => {
  try {
    const items = await Content.find({ category: 'free' });
    res.json({ content: items });
  } catch (err) {
    next(err);
  }
});

// GET /content/premium - only premium/pro users
router.get('/premium', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    // check subscription
    const plan = user.subscription?.plan || 'free';
    if (!['premium', 'pro'].includes(plan)) {
      return res.status(403).json({ error: 'Upgrade to premium to access this content' });
    }
    const items = await Content.find({ category: 'premium' });
    res.json({ content: items });
  } catch (err) {
    next(err);
  }
});

// POST /content - only admins create content
router.post('/', requireAuth, requireRole(['admin']), async (req, res, next) => {
  try {
    const { title, body, category='free', price=0 } = req.body;
    if (!['free','premium'].includes(category)) return res.status(400).json({ error: 'Invalid category' });
    const item = await Content.create({
      title, body, category, price, createdBy: req.user.id
    });
    res.status(201).json({ message: 'Content created', content: item });
  } catch (err) {
    next(err);
  }
});

// DELETE /content/:id - admin only
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const found = await Content.findByIdAndDelete(id);
    if (!found) return res.status(404).json({ error: 'Content not found' });
    res.json({ message: 'Content deleted' });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/purchase', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ error: 'Content not found' });
   
    if (content.category === 'free') return res.json({ message: 'Content is free' });


    let finalPrice = content.price;
    if (user.subscription?.plan === 'pro') finalPrice = finalPrice * 0.8;
    return res.json({ message: 'Purchase simulated', amountCharged: finalPrice });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
