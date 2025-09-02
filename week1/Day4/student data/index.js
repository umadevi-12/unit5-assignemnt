const express  = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const DB_FILE = 'db.json';

const readDB = () =>{
    try{
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch(err){
        return [];
    }
};

const writeDB = (data) =>{
    fs.writeFileSync(DB_FILE,JSON.stringify(data,null,2))
}

app.get('/students' , (req,res) =>{
    const students = readDB();
    if(students.length === 0) 
        return res.json({message:"No students found"})
    res.json(students)
});

app.get('/students/:id' , (req,res) =>{
    const students = readDB();
    const student = students.find(s => s.id === parseInt(req.params.id));
    if(!student){
        return res.json({message:'No students found'})
        res.json(student)
    };

})

app.post('/students' , (req,res) =>{
    const students = readDB();
    const newStudent = {
        id : students.length > 0 ? students[students.length - 1] .id + 1 : 1,
        name:req.body.name,
        course:req.body.course,
        batch: req.body.batch
    };

    students.push(newStudent);
    writeDB(students);
    res.json(newStudent)
});

app.put('/students/:id' , (req,res) =>{
    const students = readDB();
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if(index === -1)
        return res.json({message:'No students found'});

    students[index] = {...students[index] , ... req.body};
    writeDB(students);
    res.json(students[index])
});

app.delete('/students/:id' , (req,res) =>{
    let student = readDB();
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if(index === -1)
        return res.json({message:'No students found'})

    const deleteStudent = students.splice(index , 1) [0];
    writeDB(students);
    res.json(deleteStudent)
});

app.get('/students/search', (req,res) =>{
    const {course} = req.query;
    const students = readDB().filter(s => s.course.toLowerCase() === (course || ''))
    if(students.length === 0) return res.json({message:'No students found'});
    res.json(students);
});

app.listen(PORT,() =>{
    console.log(`Server running on http://localhost:${PORT}`)
})