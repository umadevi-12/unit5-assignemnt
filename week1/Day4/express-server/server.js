const express = require('express');
const app = express();

app.get('/home' , (req,res) =>{
    res.status(200).send("<h1> Welcome to Home Page </h1>");
});

app.get('/about', (req,res) =>{
    res.status(200).json({message:"welcome to About us"});
});

app.get('/contactus', (req,res) =>{
    res.status(200).json({
        email:'support@gmail.com',
        phone:'+91-12356789',
        address:'Bangalore, India',
    });
})

app.use((req,res) =>{
    res.status(200).send("404 Not Found");
});

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Server running at http://localhost:${PORT}`)
})