const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Dish = require('../models/Dish');


router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: "Forbidden" });
  const { dishId, quantity } = req.body;
  try {
    const dish = await Dish.findById(dishId);
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    const order = await Order.create({
      user: req.user.id,
      dish: dishId,
      quantity,
      status: "Order Received",
      chef: null 
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'user') {
      orders = await Order.find({ user: req.user.id }).populate('dish');
    } else {
      orders = await Order.find().populate('dish').populate('user');
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'chef') return res.status(403).json({ message: "Forbidden" });
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
