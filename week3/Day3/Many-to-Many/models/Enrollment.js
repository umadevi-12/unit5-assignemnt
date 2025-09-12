const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    stduentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student'},
    courseId:{type:mongoose.Schema.Types.ObjectId , ref:'Course'},
    enrolledAt:{type:Date , default:Date.now},
    isActive:{type:Boolean , default:true}
} , {timestamps:true});

module.exports = mongoose.model("Enrollment" , enrollmentSchema);