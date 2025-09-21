const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const Redis = require('ioredis');
const booksDB = require('../models/book');
const cron = require('node-cron');

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL);



router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const cacheKey = `books:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return res.json(JSON.parse(cached));
  }

  console.log('Cache miss');
  const userBooks = booksDB.filter(b => b.userId === userId);
  await redis.set(cacheKey, JSON.stringify(userBooks), 'EX', 60); 
  res.json(userBooks);
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, author } = req.body;
  const userId = req.user.id;
  const newBook = { id: uuidv4(), title, author, userId };
  booksDB.push(newBook);

  await redis.del(`books:${userId}`); 
  console.log('Cache invalidated after POST');

  res.status(201).json(newBook);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  const userId = req.user.id;

  const book = booksDB.find(b => b.id === id && b.userId === userId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  book.title = title; book.author = author;
  await redis.del(`books:${userId}`);
  console.log('Cache invalidated after PUT');

  res.json(book);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const index = booksDB.findIndex(b => b.id === id && b.userId === userId);
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const deleted = booksDB.splice(index, 1);
  await redis.del(`books:${userId}`);
  console.log('Cache invalidated after DELETE');

  res.json(deleted[0]);
});



router.post('/bulk', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const bulkBooks = req.body; 
  if (!Array.isArray(bulkBooks)) return res.status(400).json({ message: "Array required" });

  await redis.lpush(`books:bulk:${userId}`, JSON.stringify(bulkBooks));
  console.log(`Stored bulk books in Redis for user ${userId}`);

  res.json({ message: "Books will be added later" });
});


cron.schedule('*/2 * * * *', async () => {
  console.log('Running bulk book insertion cron job...');
  const keys = await redis.keys('books:bulk:*');

  for (const key of keys) {
    const userId = key.split(':')[2];
    let pendingLists = await redis.lrange(key, 0, -1);

    for (const bulkStr of pendingLists) {
      const bulkBooks = JSON.parse(bulkStr);
      bulkBooks.forEach(b => booksDB.push({ ...b, id: uuidv4(), userId }));
      console.log(`Inserted ${bulkBooks.length} books for user ${userId}`);
    }

    await redis.del(key);
  }
});

module.exports = router;
