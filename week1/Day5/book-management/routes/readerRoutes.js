const express = require('express');
const router = express.Router();
const {getAvailableBooks , borrowBook , returnBook} = require("../controllers/readerController");
const returnCheckMiddleware = require("../middlewares/returnCheckMiddleware");

router.get('/books' , getAvailableBooks);
router.post('/borrow/:id' , borrowBook);
router.post('/return/:id' , returnCheckMiddleware, returnBook);

module.exports = router;