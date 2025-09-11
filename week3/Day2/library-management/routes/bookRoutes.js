const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.post("/add-book", bookController.addBook);
router.put("/update-book/:bookId", bookController.updateBook);
router.delete("/delete-book/:bookId", bookController.deleteBook);
router.post("/borrow-book", bookController.borrowBook);
router.post("/return-book", bookController.returnBook);
router.get("/book-borrowers/:bookId", bookController.getBookBorrowers);

module.exports = router;
