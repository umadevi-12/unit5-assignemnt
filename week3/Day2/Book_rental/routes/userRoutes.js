const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/add-user', userController.addUser);


router.get('/user-rentals/:userId', userController.getUserRentals);

module.exports = router;
