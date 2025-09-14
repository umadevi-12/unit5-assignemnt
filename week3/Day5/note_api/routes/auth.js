const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Name, email, and password required' });

        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = new User({ name, email, password: hashed });
        await user.save();

        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set in .env');

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created',
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });

        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set in .env');

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
