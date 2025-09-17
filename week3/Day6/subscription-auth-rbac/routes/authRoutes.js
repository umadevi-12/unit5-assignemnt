const express = require('express');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt');
const BlacklistedToken = require('../models/BlacklistedToken');
const User = require('../models/User');
const { getBearerToken } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/signup', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, email, passwordHash });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user._id.toString(), role: user.role };
    const accessToken = jwtUtils.signAccessToken(payload);
    const refreshToken = jwtUtils.signRefreshToken(payload);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const accessToken = getBearerToken(req);
    const { refreshToken } = req.body;

    if (!accessToken && !refreshToken) return res.status(400).json({ error: 'No tokens provided' });

    const addToBlacklist = async (token, type, expiryDate) => {
      if (!token) return;
      try {

        const decoded = require('jsonwebtoken').decode(token);
        const exp = decoded && decoded.exp ? (decoded.exp * 1000) : (expiryDate ? expiryDate.getTime() : Date.now());
        const expiryAt = new Date(exp);
        await BlacklistedToken.create({ token, type, expiryAt });
      } catch (err) {
     
        const fallbackExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await BlacklistedToken.create({ token, type, expiryAt: fallbackExpiry });
      }
    };

    await Promise.all([
      addToBlacklist(accessToken, 'access'),
      addToBlacklist(refreshToken, 'refresh')
    ]);

    return res.json({ message: 'Logged out - tokens blacklisted' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /refresh
 * body: { refreshToken }
 * returns new accessToken
 * Reject if refresh token is blacklisted
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });

    // check blacklisted
    const blacklisted = await BlacklistedToken.findOne({ token: refreshToken });
    if (blacklisted) return res.status(401).json({ error: 'Refresh token blacklisted' });

    // verify
    try {
      const payload = jwtUtils.verifyRefreshToken(refreshToken);
      const newAccess = jwtUtils.signAccessToken({ id: payload.id, role: payload.role });
      res.json({ accessToken: newAccess });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
