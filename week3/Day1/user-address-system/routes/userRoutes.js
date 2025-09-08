const express = require('express');
const User = require('../models/User');
const router = express.Router();

// ----------------- CREATE USER -----------------
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        if (error.code === 11000) { // duplicate email
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(400).json({ error: error.message });
    }
});

// ----------------- ADD ADDRESS -----------------
router.post('/users/:userId/address', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.addresses.push(req.body);
        await user.save();
        res.json({ message: 'Address added', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ----------------- GET SUMMARY -----------------
router.get('/users/summary', async (req, res) => {
    try {
        const users = await User.find();
        const totalUsers = users.length;
        const totalAddresses = users.reduce((sum, u) => sum + u.addresses.length, 0);
        const userSummary = users.map(u => ({
            name: u.name,
            addressCount: u.addresses.length
        }));
        res.json({ totalUsers, totalAddresses, userSummary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ----------------- GET SINGLE USER -----------------
router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ----------------- DELETE ADDRESS -----------------
router.delete('/users/:userId/address/:addressId', async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        address.remove();
        await user.save();

        res.json({ message: 'Address deleted', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
