const express = require('express');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

app.use(express.json());

const limiter = rateLimit({
    windowMs : 60 * 1000,
    max : 5,
    message:{error:'Too many requests , please try again later'},
    standardHeaders:true,
    legacyHeaders:false,
});

app.use('/api' , apiRoutes(limiter));

app.use((req,res) =>{
    res.status(404).json({error:'404 Not Found'})
});

app.listen(PORT,() =>{
    console.log(`Server running on http://localhost:${PORT}`)
});