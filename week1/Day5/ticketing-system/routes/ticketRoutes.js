const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const dataCheckMiddleware = require('../middlewares/dataCheckMiddleware');

router.get('/', ticketController.getAll);
router.get('/:id', ticketController.getById);


router.post('/', dataCheckMiddleware, ticketController.create);

router.put('/:id', ticketController.update);


router.delete('/:id', ticketController.remove);

router.patch('/:id/resolve', ticketController.resolve);

module.exports = router;
