const express = require('express');
const fs = require('fs');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const readerRoutes = require('./routes/readerRoutes');
const loggerMiddleware = require('./middlewares/loggerMiddleware');

app.use(express.json());
app.use(loggerMiddleware);

app.use('/admin',adminRoutes);
app.use('/reader' , readerRoutes);

app.use((req,res) =>{
    res.status(404).json({error:'Route not found'})
});

const PORT = 3000;
app.listen(PORT , () =>{
      console.log(`Server is  running on http://localhost:${PORT}`);
})