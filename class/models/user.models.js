const mongooose = require('mongoose');

const userSchema = new mongooose.Schema({
    name:String,
    email:String,
    age:Number,
    gender:String
})

const UserModel = mongooose.model("User" , userSchema);
module.exports = UserModel;