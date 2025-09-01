const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const DB_FILE = 'db.json';


const readDishes = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeDishes = (dishes) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(dishes, null, 2));
};


app.post('/dishes', (req, res) => {
  const dishes = readDishes();
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newDish = {
    id: dishes.length ? dishes[dishes.length - 1].id + 1 : 1,
    name,
    price,
    category
  };

  dishes.push(newDish);
  writeDishes(dishes);

  res.status(201).json(newDish);
});


app.get('/dishes', (req, res) => {
  const dishes = readDishes();
  res.status(200).json(dishes);
});


app.get('/dishes/:id', (req, res) => {
  const dishes = readDishes();
  const dish = dishes.find(d => d.id === Number(req.params.id));

  if (!dish) return res.status(404).json({ message: 'Dish not found' });
  res.status(200).json(dish);
});

app.put('/dishes/:id', (req,res) => {
    const dishes = readDishes();
    const dishIndex = dishes.findIndex(d => d.id === Number(req.params.id));

    if(dishIndex === -1)
        return res.status(404).json({message:'Dish not found'});

    const {name, price, category} = req.body;

    if(!name && !price && !category)
        return res.status(400).json({error:'At least one field is required'});

    dishes[dishIndex] = { ...dishes[dishIndex], ...req.body };
    writeDishes(dishes);

    res.status(200).json(dishes[dishIndex]);
});


app.delete('/dishes/:id', (req, res) => {
  const dishes = readDishes();
  const dishIndex = dishes.findIndex(d => d.id === Number(req.params.id));

  if (dishIndex === -1) return res.status(404).json({ message: "Dish not found" });

  const deleted = dishes.splice(dishIndex, 1);
  writeDishes(dishes);

  res.status(200).json({ message: "Dish deleted", dish: deleted[0] });
});


app.get('/dishes/get', (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Name query required' });

  const dishes = readDishes();
  const result = dishes.filter(d => d.name.toLowerCase().includes(name.toLowerCase()));

  if (result.length === 0) return res.status(404).json({ message: 'No dishes found' });
  res.status(200).json(result);
});

app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
