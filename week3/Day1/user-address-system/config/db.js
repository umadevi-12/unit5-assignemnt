const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/user_address_system');
        console.log("MongoDB connected")
    }
    catch(err){
        console.error('MognoDB connection error : ' , err);
        process.exit(1);
    }
}

module.exports = connectDB