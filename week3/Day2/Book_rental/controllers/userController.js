const User = require('../models/User');
const Book = require('../models/Book');

exports.addUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.getUserRentals = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('rentedBooks');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user.rentedBooks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
