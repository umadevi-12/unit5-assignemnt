const express = require('express');
const app = express();

const users = [
    {id:1,name:'John Doe' , email : "Jhon@gmail.com"},
    {id : 2, name :"Jane Doe" , email : "jane@gmail.com"},
    {id : 3 , name : 'Bob Smith', email:'bob@gmail.com'},
];

app.get('/users/get', (req,res) =>{
    res.status(200).json(users[0])
});

app.get('/users/list' , (req,res) =>{
    res.status(200).json(users);
});
app.use((req,res) =>{
    res.status(404).json({error:'404 Not Found'});
});

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Server running at http://localhost:${PORT}`)
})