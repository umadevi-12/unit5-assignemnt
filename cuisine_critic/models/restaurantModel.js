const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name:{type:String , required:true , unique:true},
    cuisine:{type:String , required:true , enum:['Italian','Mexican','Indian','Chinese','Other']},
    address:{type:String ,required:true},
    averageRating:{type:Number , default:0}
});

module.exports = mongoose.model("Restaurant" , restaurantSchema)