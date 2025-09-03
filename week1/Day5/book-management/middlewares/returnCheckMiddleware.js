const fs = require('fs');
const returnCheckMiddleware = (req,res,next) =>{
    const books = JSON.parse(fs.readFileSync('./db.json'));
    const book = books.find(b => b.id === parseInt(req.params.id));

    if(!book){
        return res.status(404).json({error:'Book not found'})
    }

    if(book.status !== 'borrowed'){
        return res.status(404).json({error:'Book is not borrowed'});
    }

    const borrowedDate = new Date(book.borrowedDate);
    const currentDate = new Date();
    const diffDays = Math.floor((currentDate - borrowedDate) / (1000 * 60 * 60 * 24));

    if(diffDays < 3){
        return res.status(400).json({error : 'Book cannot be returned within 3 days of borrowing'})
    }
    next();

};
module.exports = returnCheckMiddleware;