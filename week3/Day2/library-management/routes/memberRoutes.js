const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.post("/add-member", memberController.addMember);
router.get("/member-borrowed-books/:memberId", memberController.getMemberBorrowedBooks);

module.exports = router;
