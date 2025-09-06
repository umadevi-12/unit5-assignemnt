const mongoose = require('mongoose');

const taskShema = new mongoose.Schema({
    title:String,
    description:String,
    priority:String,
    isCompleted:{type:Boolean, default:false},
    completionDate:Date,
    dueDate:Date
} , {timestamps:true});
module.exports = mongoose.model('Task' , taskShema);