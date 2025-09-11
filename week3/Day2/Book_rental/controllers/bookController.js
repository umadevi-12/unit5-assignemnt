const Book = require('../models/Book');
const User = require('../models/User');

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre });
    return res.status(201).json({ success: true, data: book });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.rentBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!user || !book) {
      return res.status(404).json({ success: false, message: 'User or Book not found' });
    }

    await User.findByIdAndUpdate(userId, { $addToSet: { rentedBooks: bookId } }, { new: true });
    await Book.findByIdAndUpdate(bookId, { $addToSet: { rentedBy: userId } }, { new: true });

    return res.status(200).json({ success: true, message: 'Book rented successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!user || !book) {
      return res.status(404).json({ success: false, message: 'User or Book not found' });
    }

    await User.findByIdAndUpdate(userId, { $pull: { rentedBooks: bookId } });
    await Book.findByIdAndUpdate(bookId, { $pull: { rentedBy: userId } });

    return res.status(200).json({ success: true, message: 'Book returned successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookRenters = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('rentedBy');
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    return res.status(200).json({ success: true, data: book.rentedBy });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updates = req.body;
    const updated = await Book.findByIdAndUpdate(bookId, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Book not found' });
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const deleted = await Book.findByIdAndDelete(bookId);
    if (!deleted) return res.status(404).json({ success: false, message: 'Book not found' });

 
    await User.updateMany(
      { rentedBooks: bookId },
      { $pull: { rentedBooks: bookId } }
    );

    return res.status(200).json({ success: true, message: 'Book deleted and user references updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
