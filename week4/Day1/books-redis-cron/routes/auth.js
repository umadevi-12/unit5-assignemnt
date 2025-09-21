const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const users = [];

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: "Email already in use" });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), email, password: hashed };
  users.push(user);

  res.status(201).json({ message: "User created", user: { id: user.id, email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
  res.json({ token, user: { id: user.id, email } });
});

module.exports = router;
