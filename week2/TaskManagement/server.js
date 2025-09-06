const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const Task = require('./models/Task');


const app = express();
app.use(bodyParser.json());

async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/TaskDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
connectDB();

app.listen(3000,() =>{
    console.log(`Server running on port 3000`)
})