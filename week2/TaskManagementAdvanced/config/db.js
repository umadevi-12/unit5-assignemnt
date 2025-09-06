const mongoose = require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/TaskDB');
        console.log('MongoDB conncted succesfully')
    }
    catch(err){
        console.error('MongoDB connection error' , err)
        process.exit(1);
    }
}

module.exports = connectDB;