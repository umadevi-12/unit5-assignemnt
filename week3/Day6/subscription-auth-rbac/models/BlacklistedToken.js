const mongoose = require('mongoose');
const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  type: { type: String },
  blacklistedAt: { type: Date, default: Date.now },

  expiryAt: { type: Date, required: true }
});

TokenSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('BlacklistedToken', TokenSchema);
