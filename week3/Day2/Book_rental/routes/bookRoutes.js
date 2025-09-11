const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');


router.post('/add-book', bookController.addBook);


router.post('/rent-book', bookController.rentBook);

router.post('/return-book', bookController.returnBook);
router.get('/book-renters/:bookId', bookController.getBookRenters);

router.put('/update-book/:bookId', bookController.updateBook);

router.delete('/delete-book/:bookId', bookController.deleteBook);

module.exports = router;
