const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'pending' },
  dueDate: Date
});

module.exports = mongoose.model('Task', taskSchema);
