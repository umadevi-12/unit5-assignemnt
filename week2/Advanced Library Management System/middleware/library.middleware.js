const Library = require("../models/library.model");

const validateBookData = (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).send("Incomplete Data");
  next();
};

const checkBorrowEligibility = async (req, res, next) => {
  try {
    const { borrowerName } = req.body;
    if (!borrowerName)
         return res.status(400).send("borrowerName required");

    const book = await Library.findById(req.params.id);
    if (!book) 
        return res.status(404).send("Book not found");
    if (book.status === "borrowed") 
        return res.status(409).send("Book already borrowed");

    const count = await Library.countDocuments({ borrowerName, status: "borrowed" });
    if (count >= 3) return res.status(409).send("Borrowing limit exceeded");

    req.book = book;
    next();
  } catch {
    res.status(500).send("Server error");
  }
};

const checkReturnEligibility = async (req, res, next) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    if (book.status !== "borrowed") 
        return res.status(409).send("Book not borrowed");
    req.book = book;
    next();
  } catch {
    res.status(500).send("Server error");
  }
};


module.exports =
 {
    validateBookData, 
    checkBorrowEligibility, 
    checkReturnEligibility
 };
