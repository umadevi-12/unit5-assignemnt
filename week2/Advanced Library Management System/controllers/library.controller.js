const Library = require("../models/library.model");


const addBook = async (req, res) => {
  try {
    const book = new Library({ ...req.body, status: "available" });
    await book.save();
    res.status(201).send(book);
  } catch {
    res.status(500).send("Error adding book");
  }
};

const borrowBook = async (req, res) => {
  try {
    const book = req.book;
    let now = new Date();
    book.status = "borrowed";
    book.borrowerName = req.body.borrowerName;
    book.borrowDate = now;
    book.dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    await book.save();
    res.send(book);
  } catch {
    res.status(500).send("Error borrowing book");
  }
};


const returnBook = async (req, res) => {
  try {
    const book = req.book, now = new Date();
    let fee = 0;
    if (book.dueDate && now > book.dueDate) {
      fee = Math.ceil((now - book.dueDate) / (1000 * 60 * 60 * 24)) * 10;
      book.overdueFees += fee;
    }
    book.status = "available";
    book.returnDate = now;
    book.borrowerName = null;
    book.borrowDate = null;
    book.dueDate = null;
    await book.save();
    res.send({ book, message: fee ? `Overdue Rs.${fee}` : "Returned" });
  } catch {
    res.status(500).send("Error returning book");
  }
};

const getBooks = async (req, res) => {
  console.log("🔥 getBooks controller hit"); 
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.title) filter.title = new RegExp(req.query.title, "i");
    const books = await Library.find(filter);
    res.send(books);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching books");
  }
};


const deleteBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    if (book.status === "borrowed") return res.status(409).send("Cannot delete borrowed book");
    await Library.findByIdAndDelete(req.params.id);
    res.send("Book deleted");
  } catch {
    res.status(500).send("Error deleting book");
  }
};

module.exports = { addBook, borrowBook, returnBook, getBooks, deleteBook };
