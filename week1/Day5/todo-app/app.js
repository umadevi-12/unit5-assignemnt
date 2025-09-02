const express = require('express');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/todos', todoRoutes);


app.use('*', (req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Server is  running on http://localhost:${PORT}`);
});