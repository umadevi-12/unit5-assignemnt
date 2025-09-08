const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

connectDB();

app.use('/api' , userRoutes);

app.listen(3000 , () =>{
    console.log(`Server running on port 3000`)
})