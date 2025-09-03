const fs = require('fs');

const getBooks = (req,res) =>{
    const books = JSON.parse(fs.readFileSync('./db.json'));
    res.json(books);
};

const addBook = (req,res) =>{
    const books = JSON.parse(fs.readFileSync('./db.json'));
    const {title,author,genre,publishedYear}  = req.body;
    const id = books.length ? books[books.length - 1].id + 1 : 1;
    const newBook  = {id,title,author , genre,publishedYear, status:'available'};
    books.push(newBook);
    fs.writeFileSync('./db.json' , JSON.stringify(books,null,2));
    res.status(201).json(newBook) 
};

const updateBook = (req,res) =>{
    const books = JSON.parse(fs.readFileSync('./db.json'));
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book) 
        return res.status(404).json({error:'Book not found'});

    Object.assign(book,req.body);
    fs.writeFileSync('./db.json' , JSON.stringify(books,null,2));
    res.json(book)
};

const deleteBook = (req,res) =>{
    let books = JSON.parse(fs.readFileSync('./db.json'));
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if(bookIndex === -1)
        return res.status(404).json({error:'Book not found'})

    const deleteBook = books.splice(bookIndex,1);
    fs.writeFileSync('./db.json' , JSON.stringify(books,null,2));
    res.json({message:'Book deleted' ,deleteBook})
}

module.exports = {getBooks,addBook,updateBook,deleteBook}