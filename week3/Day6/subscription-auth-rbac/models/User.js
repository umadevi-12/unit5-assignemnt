const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  plan: { type: String, enum: ['free','premium','pro'], default: 'free' },
  startAt: Date,
  expiresAt: Date
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  subscription: { type: SubscriptionSchema, default: { plan: 'free' } },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
