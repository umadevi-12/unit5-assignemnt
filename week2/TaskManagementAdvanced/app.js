const express = require("express");
const connectDB = require('./config/db');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(express.json());

connectDB();

app.use('/', taskRoutes);

app.get('/' , (req,res) =>{
    res.send('Task management API')
})

const PORT = process.env.PORT|| 3000;
app.listen(PORT , () => console.log(`Server running on port ${PORT}`))
