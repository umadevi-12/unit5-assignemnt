const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { name, description, price } = req.body;
    const dish = await Dish.create({ name, description, price });
    res.status(201).json(dish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
