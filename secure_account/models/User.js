const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
        match:[/^\S+@\S+\.\S+$/,'please use a valid email address']
    },

    password:{
        type:String,
        required:true,
    },
    passwordResetToken:String,
    passwordResetExpires:Date,

});

module.exports = mongoose.model("User", userSchema);
