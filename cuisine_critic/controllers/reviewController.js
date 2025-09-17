const restaurantModel = require('../models/restaurantModel');
const Review = require('../models/reviewModel');

exports.createReview = async (req,res) =>{
    const review = await Review.create({...req.body , restaurant:req.params.restaurantId})
    await Review.calculateAverageRating(req.params.restaurantId);

    res.status(201).json(review)
};

exports.getReviewByRestaurant = async (req,res) =>{
    const reviews = await Review.find({restaurant:req.params.restaurantId});

    res.json(reviews)
};

exports.deleteReview = async(req,res) =>{
    const review = await Review.findByIdAndDelete(req.params.reviewId);

    if(review)
        await Review.calculateAverageRating(review.restaurant);
    
    res.json({message:'Review Deleted'})
};