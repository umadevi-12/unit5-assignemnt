const express = require('express');
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

router.post('/subscribe', requireAuth, async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!['premium','pro'].includes(plan)) return res.status(400).json({ error: 'Invalid plan' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.subscription = {
      plan,
      startAt: new Date(),
      expiresAt: daysFromNow(30)
    };
    await user.save();

    return res.json({ message: 'Subscribed', subscription: user.subscription });
  } catch (err) {
    next(err);
  }
});

router.get('/subscription-status', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.subscription && user.subscription.expiresAt && new Date() > user.subscription.expiresAt) {
      user.subscription = { plan: 'free' };
      await user.save();
    }

    res.json({ subscription: user.subscription });
  } catch (err) {
    next(err);
  }
});

router.patch('/renew', requireAuth, async (req, res, next) => {
  try {
    const extendDays = parseInt(req.body.extendDays || 30, 10);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.subscription || user.subscription.plan === 'free') {
      return res.status(400).json({ error: 'No active paid subscription to renew' });
    }


    const now = new Date();
    if (user.subscription.expiresAt && user.subscription.expiresAt > now) {
      user.subscription.expiresAt = new Date(user.subscription.expiresAt.getTime() + extendDays * 24 * 3600 * 1000);
    } else {
      user.subscription.startAt = now;
      user.subscription.expiresAt = daysFromNow(extendDays);
    }
    await user.save();
    res.json({ message: 'Subscription renewed', subscription: user.subscription });
  } catch (err) {
    next(err);
  }
});

router.post('/cancel-subscription', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.subscription = { plan: 'free' };
    await user.save();
    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
