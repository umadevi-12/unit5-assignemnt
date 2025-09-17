const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/' , restaurantController.createRestaurant);

router.get('/' , restaurantController.getRestaturants);

router.get('/:id' , restaurantController.getRestaturantById);

router.put('/:id' , restaurantController.UpdateRestaurant);

module.exports = router;