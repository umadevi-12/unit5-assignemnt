const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const DB_FILE = 'db.json';

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to DB:', err);
  }
};


app.post('/books', (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ error: "Title, author, and year are required" });
  }

  const books = readDB();
  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    year
  };

  books.push(newBook);
  writeDB(books);
  res.status(201).json(newBook);
});


app.get('/books', (req, res) => {
  const books = readDB();
  res.status(200).json(books);
});


app.get('/books/:id', (req, res) => {
  const books = readDB();
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.status(200).json(book);
});


app.put('/books/:id', (req, res) => {
  const books = readDB();
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const { title, author, year } = req.body;
  if (title) books[index].title = title;
  if (author) books[index].author = author;
  if (year) books[index].year = year;

  writeDB(books);
  res.status(200).json(books[index]);
});


app.delete('/books/:id', (req, res) => {
  let books = readDB();
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const deleted = books.splice(index, 1);
  writeDB(books);
  res.status(200).json(deleted[0]);
});


app.get('/books/search', (req, res) => {
  const { author, title } = req.query;
  let results = readDB();

  if (author) {
    const authorQuery = author.toLowerCase();
    results = results.filter(b => b.author.toLowerCase().includes(authorQuery));
  }

  if (title) {
    const titleQuery = title.toLowerCase();
    results = results.filter(b => b.title.toLowerCase().includes(titleQuery));
  }

  if (results.length === 0) return res.status(404).json({ message: 'No books found' });

  res.status(200).json(results);
});


app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
