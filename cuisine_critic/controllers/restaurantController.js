const Restaurant = require('../models/restaurantModel');


exports.createRestaurant = async (req,res) =>{
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
};

exports.getRestaturants = async (req,res) =>{
    const filter = {};
    if(req.query.cuisine) filter.cuisine = req.query.cuisine;

    const restaurants = await Restaurant.find(filter);
    res.json(restaurants)
};

exports.getRestaturantById = async (req,res) =>{
    const restaurant = await Restaurant.findById(req.params.id);
    if(!restaurant)
        return res.status(404).json({message:'Restautant not found'})
    res.json(restaurant)
}

exports.UpdateRestaurant = async (req,res) =>{
    try{
       const restaurant = await Restaurant.findByIdAndUpdate(req.params.id , req.body , {new:true, runValidators:true});

       if(!restaurant){
        return res.status(404).json({message:"Restatunt not found"})
       }
       res.json(restaurant)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
};