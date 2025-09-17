const User = require('../models/User');

async function autoDowngradeExpiredSubscriptions() {
  const now = new Date();
  try {
    const expired = await User.find({
      'subscription.expiresAt': { $lte: now },
      'subscription.plan': { $in: ['premium', 'pro'] }
    });

    if (!expired.length) {
      console.log('No expired subscriptions found');
      return;
    }

    const ids = expired.map(u => u._id);
    await User.updateMany(
      { _id: { $in: ids } },
      { $set: { subscription: { plan: 'free' } } }
    );

    console.log(`Downgraded ${ids.length} users to free plan`);
  } catch (err) {
    console.error('Error in subscription cleaner', err);
  }
}

module.exports = { autoDowngradeExpiredSubscriptions };
