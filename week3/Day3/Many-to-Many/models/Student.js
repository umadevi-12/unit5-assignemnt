const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:String,
    email:String,
    isActive:{type:Boolean , default:true}
} , {timestamps:true});

module.exports = mongoose.model('Student',studentSchema);