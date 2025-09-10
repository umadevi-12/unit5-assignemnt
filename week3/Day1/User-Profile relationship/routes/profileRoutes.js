const express = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');
const router = express.Router();

router.post('/add-profile' , async (req,res) =>{
    try{
        const {bio , socialMediaLinks , user} = req.body;

        const existingUser = await User.findById(user);
        if(!existingUser){
            return res.status(404).json({error:'User not found'})
        }

        const existingProfile = await Profile.findOne({user});
        if(existingProfile){
            return res.status(404).json({error:'Profile already exists for this user'})
        }

        const profile = new Profile({bio , socialMediaLinks,user});
        await profile.save();

        res.status(201).json({message:'Profile created succesfully' , profile})

    }
    catch(error){
        res.status(400).json({error:error.message})
    }
});

router.get('/profiles' , async (req,res) =>{
    try{
        const profile = await Profile.find().populate('user' , 'name email');
        res.json(profile)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
});

module.exports = router;