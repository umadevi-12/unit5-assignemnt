const Book = require("../models/Book");
const Member = require("../models/Member");


exports.addBook = async (req, res) => {
    try {
        const { title, author } = req.body;
        const book = await Book.create({ title, author });
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
        res.json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.bookId);
        if (book) {
            await Member.updateMany(
                { borrowedBooks: book._id },
                { $pull: { borrowedBooks: book._id } }
            );
        }
        res.json({ message: "Book deleted successfully." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.borrowBook = async (req, res) => {
    try {
        const { memberId, bookId } = req.body;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ error: "Book not found." });
        if (book.status === "borrowed") return res.status(400).json({ error: "Book already borrowed." });

        book.status = "borrowed";
        book.borrowers.push(memberId);
        await book.save();

        const member = await Member.findById(memberId);
        member.borrowedBooks.push(bookId);
        await member.save();

        res.json({ message: "Book borrowed successfully." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { memberId, bookId } = req.body;

        const book = await Book.findById(bookId);
        book.status = "available";
        book.borrowers.pull(memberId);
        await book.save();

        const member = await Member.findById(memberId);
        member.borrowedBooks.pull(bookId);
        await member.save();

        res.json({ message: "Book returned successfully." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getBookBorrowers = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId).populate("borrowers", "name email");
        res.json(book.borrowers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
