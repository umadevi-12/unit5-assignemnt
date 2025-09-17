const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reviewDeleteRoute = require('./routes/reviewDeleteRoute');

const notFound = require('./middleware/notFound')

dotenv.config();
const app = express();

app.use(express.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log("MongoDB connected"))
 .catch(err => console.log(err));

 app.use('/api/restaurants' , restaurantRoutes);
 app.use('/api/restaurants/:restaurantId/reviews' , reviewRoutes);

 app.use('/api/reviews' , reviewDeleteRoute);

 app.use(notFound);

 const PORT = process.env.PORT || 5000;
 app.listen(PORT,() =>console.log(`Server running on port ${PORT}`))