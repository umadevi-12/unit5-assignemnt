const express = require('express');
const router = express.Router();

const libraryController = require('../controllers/library.controller');
const {
  validateBookData,
  checkBorrowEligibility,
  checkReturnEligibility
} = require('../middleware/library.middleware');

router.post('/books', validateBookData, libraryController.addBook);

router.patch('/borrow/:id', checkBorrowEligibility, libraryController.borrowBook);

router.patch('/return/:id', checkReturnEligibility, libraryController.returnBook);

router.get('/books', libraryController.getBooks);

router.delete('/books/:id', libraryController.deleteBook);

module.exports = router;
