const express = require('express');
const connectDB = require('./config/db');
const libraryRoutes = require('./routes/library.routes');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json()); 
app.use('/library', libraryRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
