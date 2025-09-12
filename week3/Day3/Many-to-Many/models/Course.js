const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title:String,
  description:String,
  isActive:{type:Boolean , default:true}
} , {timestamps:true});

module.exports = mongoose.model('Course' , courseSchema);