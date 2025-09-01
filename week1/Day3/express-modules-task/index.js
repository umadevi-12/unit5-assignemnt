const express = require('express');
const os = require('os');
const dns = require('dns');
const {readFileContent} = require('./read');

const app = express();
const PORT = 3000;

app.get('/test' , (req,res) =>{
    res.send('Test route is working!')
});

app.get('/readfile',(req,res) =>{
    const content = readFileContent();
    res.send(content)
});

app.get('/systemdetails', (req,res) =>{
    const details = {
        platform : os.platform(),
        totalMemory:`${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
        freeMemory:`${(os.freemem() / (1024 ** 3)) .toFixed(2)} GB`,
        cpuModel:os.cpus()[0].model,
        cpuCores:os.cpus().length
    };
    res.json(details)
});

app.get('/getip' , (req,res) =>{
    dns.lookup('masaischool.com', {all:true} , (err,addresses) =>{
        if(err){
            res.status(500).json({error:err.message})
        }
        else{
            res.json({
                hostname:'masaischool.com',
                ipAddresses:addresses.map(addr => addr.address)
            })
        }
    })
})

app.listen(PORT,() =>{
    console.log(`Server is running on http://localhost:${PORT}`)
})