const express = require('express');
const {getFileInfo} = require('./fileinfo');
const {parseUrl} = require('./urlparser');

const app = express();
const PORT = 3000;

app.get('/test',(req,res) =>{
    res.send("Test route is working!");
});

app.get('/fileinfo', (req, res) =>{
    console.log("Query params:", req.query); 
    const {filepath} = req.query;

    if(!filepath){
        return res.json({message:"Please provide a filepath query parameter"});
    }

    const details = getFileInfo(filepath);
    res.json(details)
});

app.get('/parseurl' , (req,res) =>{
    const {url} = req.query;
    if(!url){
        return res.json({message:'Please provide a url query parameter'});

    }
    const details = parseUrl(url);
    res.json(details);
});

app.listen(PORT,() =>{
    console.log(`Server is running on http://localhost:${PORT}`)
})