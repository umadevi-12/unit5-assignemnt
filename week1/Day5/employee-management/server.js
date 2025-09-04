const express = require('express');
const fs = require('fs');
const path = require('path');

const employeeRoute = require('./routes/employeeRoutes');
const loggerMiddle = require('./middlewares/loggerMiddleware');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/employees' , employeeRoute);
app.use((req,res) =>{
    res.status(404).json({error:'Route not found'})
});

app.listen(PORT , () =>{
    console.log(`Server running at http://localhost:${PORT}`)
})