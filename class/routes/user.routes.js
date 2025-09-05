const express = require('express');
const UserRouter = express.Router();

UserRouter.post('/add-user',async (req,res) =>{
try{
    let user = await UserModel.create(req.body);
    res.status(200).json({msg:'User created',user})
}
catch(err){
    res.status(500)
}

})