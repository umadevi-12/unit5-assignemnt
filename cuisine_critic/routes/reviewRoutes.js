const express = require('express');
const router = express.Router({mergeParams:true});
const reviewController = require('../controllers/reviewController');

router.post('/' ,reviewController.createReview);
router.get('/' , reviewController.getReviewByRestaurant);

module.exports = router