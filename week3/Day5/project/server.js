const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware')

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err)) ;

app.use('/api/auth' , authRoutes);

app.get('/api/protected' , authMiddleware ,(req,res) =>{
    res.json({message:'Welcome to protected route' , user:req.user});
});

const PORT = process.env.PORT||5000;
app.listen(PORT , () => console.log(`Server running on port ${PORT}`))