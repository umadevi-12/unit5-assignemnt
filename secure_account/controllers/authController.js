const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail');

const register = async (req,res) =>{
    try{
        const{email,password} = req.body;

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({email,password:hashedPassword})

        res.status(201).json({success:true, message:'User registred', userId:user._id});
     }
     catch(error){
        res.status(500).json({success:false, error:error.message});
        
     }
}

const login = async(req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user)
        
         return res.status(400).json({success:false, message:'Invalid credentinal'});

      console.log("User found:",user)
        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch) 
        return res.status(400).json({success:false , message:'Invalid credentinal'});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'1hr'});
        return res.status(200).json({success:true, token});

    }
    catch(error){
        console.error("Login error",error)
        return res.status(500).json({success:false, error:error.message});
    }
};

const forgotPassword = async(req,res) =>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user) return res.json({success:true, message:'Password reset email sent if user exits'});

        const resetToken = crypto.randomBytes(32).toString('hex');

        const hashedToken =  crypto.createHash('sha256').update(resetToken).digest('hex');

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 10  * 60 * 1000;

        await user.save();

        const resetURL = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

        const message = `you requested a password reset.Use the link below:\n\n${resetURL}\n\nIf you did not request this email, please ignore it.`;

        await sendEmail({ email:user.email, subject:'password Reset', message});
        res.json({success:true, message:'password reset email sent if user exits'});

    }
    catch(error){
        res.status(500).json({success:false,error:error.message});
    }
};

const resetPassword = async(req,res) =>{
    try{
        const{token} = req.params;
        const{password} = req.body;
        
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken:hashedToken,
            passwordResetExpires:{$gt:Date.now()}
        });

        if(!user) 
            return res.status(400).json({success:true,message:'Token is invalid or expired'});

        const hashedPassword = await bcrypt.hash(password,10)
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
         return res.status(200).json({success:true,message:'password reset successful'})

    }
    catch(error){
        res.status(500).json({success:false,error:error.message});
    }
};

module.exports = {register,login,forgotPassword,resetPassword};