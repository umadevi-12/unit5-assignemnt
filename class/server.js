const express = require("express");
const connectedDB = require();

const app = express();
app.use(express.json);
connectedDB();

app.get('/test',(req,res) =>{
    res.status(200).json({message:'conncted to DB'})
})
app.use('/users' ,UserRouter);

app.use((req,res) =>{
    res.status(404).json({message:"This is requesr"})
})
app.listen(3000,()=>{
    console.log('Server started...')
})


