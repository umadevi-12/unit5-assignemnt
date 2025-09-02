const express = require('express');
const app = express();
const ticketRouter = require('./routes/ticketRoutes');

app.use(express.json());


app.get('/', (req, res) => {
  res.send(' Ticketing System API is running! Visit /tickets for API routes.');
});


app.use('/tickets', ticketRouter);


app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});
