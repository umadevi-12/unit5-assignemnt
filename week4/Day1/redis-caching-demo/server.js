const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Redis = require('redis');

const app = express();
app.use(express.json());

const redisClient = Redis.createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  console.log('Redis connected');
})();


let items = [
  { id: uuidv4(), name: 'Item 1' },
  { id: uuidv4(), name: 'Item 2' },
];


app.get('/items', async (req, res) => {
  try {
    const cache = await redisClient.get('items:all');
    if (cache) {
      console.log('Cache hit');
      return res.json(JSON.parse(cache));
    }
    console.log('Cache miss');
    await redisClient.set('items:all', JSON.stringify(items), { EX: 60 }); 
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/items', async (req, res) => {
  try {
    const { name } = req.body;
    const newItem = { id: uuidv4(), name };
    items.push(newItem);

    await redisClient.del('items:all');
    console.log('Cache invalidated after POST');

    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });

    items[index].name = name;

    await redisClient.del('items:all');
    console.log('Cache invalidated after PUT');

    res.json(items[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });

    const deleted = items.splice(index, 1);

    await redisClient.del('items:all');
    console.log('Cache invalidated after DELETE');

    res.json(deleted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
