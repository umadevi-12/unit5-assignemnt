const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async(req,res,next) =>{
    try{
        const authHeader = req.header('Authorization') || '';
        const token = authHeader.startWith('Bearer') ? authHeader.slice(7) :null;

        if(!token)
            return res.status(401).json({message:'No token provided'});

        const decode = jwt.verify(token , process.env.JWT_SECRET);
        req.user = {id:decode.id , email:decode.email};
        next();
    }
    catch(err){
        console.error('Auth middleware error:' , err.message);
        return res.status(401).json({message:'Invalid or expired token'})
    }
};

module.exports = authMiddleware