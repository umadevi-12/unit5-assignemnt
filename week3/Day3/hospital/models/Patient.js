const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name:{type:String , required:true},
    age:{type:Number , required:true},
    gender:{type:String , enum:['male' ,'female' ,'other'] , required:true},
    isActive:{type:Boolean , default:true}
});

module.exports = mongoose.model('Patient' , patientSchema)