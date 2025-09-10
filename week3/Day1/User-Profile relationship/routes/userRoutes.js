const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/add' , async(req,res) =>{
    try{
        const {name , email} = req.body;
        const user = new User({name , email});
        await user.save();

        res.status(201).json({message:'User created succesfully' , user})
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

module.exports = router;