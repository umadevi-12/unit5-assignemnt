const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const User = require('../models/User');


router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: 'Name, email, and password required' });

    try {
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Email and password required' });

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
