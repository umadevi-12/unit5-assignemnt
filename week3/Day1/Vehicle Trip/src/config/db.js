const express = require('express');
const vehicleRoutes = require('./routes/vehicleRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('Vehicle Trip Management API'));

app.use('/api/vehicles', vehicleRoutes);

app.use(errorHandler);

module.exports = app;
