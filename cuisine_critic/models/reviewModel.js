const mongoose = require('mongoose');
const restaurantModel = require('./restaurantModel');

const reviewSchema = new mongoose.Schema({
    text:{type:String , required:true , minlength:10},
    rating:{type:Number , required:true , min:1,max:5},
    restaurant:{type:mongoose.Schema.Types.ObjectId , ref:'Restauran ', required:true}
});

reviewSchema.statics.calculateAverageRating = async function (restaurantId) {
    const stats = await this.aggregate([
        {$match:{restaurant:restaurantId }},
        {$group:{_id : "$restatuant" , avgRating :{$avg:'$rating'}}}

    ]);

    await mongoose.model('Restaurant').findByIdAndUpdate(restaurantId ,{
        averageRating:stats[0] ?
        stats[0].avgRating:0
    });
    
};

module.exports = mongoose.model('Review' , reviewSchema)