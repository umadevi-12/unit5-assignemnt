const fs = require('fs');

const transactionLogger = require("../middlewares/transactionLogger");

const getAvailableBooks = (req,res) =>{
    const books = JSON.parse(fs.readFileSync('./db.json'));
    const availableBooks = books.filter(b => b.status === 'available');
    res.json(availableBooks);
};

const borrowBook = (req,res) =>{
    const books = JSON.parse(fs.readFileSync('./db.json'));
    const book = books.find(b => b.id === parseInt(req.params.id));

    if(!book)
        return res.status(404).json({error:'Book not found'});

const {readerName}  = req.body;
if(!readerName) return res.status(400).json({error:'Reader name required'});

book.status = 'borrowed';
book.borrowedBy = readerName;
book.borrowedDate = new Date().toISOString().split('T')[0];

fs.writeFileSync('./db.json' , JSON.stringify(books.null,2));
transactionLogger(readerName,book.title,'borrowed');
res.json(book)
}

const  returnBook = (req,res) =>{
    const books = JSON.parse(fs.readFileSync('./db.json'));
    const book = books.find(b => b.id === parseInt(req.params.id) );
    
    book.status = 'available';
    const readerName = book.borrowedBy;
    book.borrowedBy = null;
    book.borrowedDate = null;

    fs.writeFileSync('./db.json' ,JSON.stringify(books,null,2));
    transactionLogger(readerName,book.title,'returned');
    res.json(book)
};

module.exports = {getAvailableBooks,borrowBook,returnBook}