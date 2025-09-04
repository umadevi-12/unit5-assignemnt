const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const taskFile = path.join(__dirname,'tasks.json');

app.use(express.json());

function readTasks(){
    const data = fs.readFileSync(taskFile,'utf-8');
    return JSON.parse(data);
}

function writeTasks(task){
    fs.writeFileSync(taskFile,JSON.stringify(task,null,2));
}

app.get('/tasks' , (req,res) =>{
    const tasks = readTasks();
    res.json(tasks);
})

app.get('/tasks/filter' , (req,res) =>{
    const {tag} = req.query;
    const tasks = readTasks();
    const filtered = tasks.filter((task) => task.tag === tag);
    res.json(filtered)
});

app.post("/tasks" ,(req,res) =>{
    const {title,description,tag,priority , status} = req.body;
    if(!title || !description || !tag || !priority || !status){
        return res.status(404).json({error:"All fields are required"});
    
    }

    const tasks = readTasks();
    const newTask = {
        id:tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description,
        tag,
        priority,
        status,
    };
    tasks.push(newTask);
    writeTasks(tasks);
    
    res.status(201).json(newTask);

});

app.put('/tasks/:id' , (req,res) =>{
    const {id} = req.params;
    const {title , description, tag, priority,status} = req.body;
    const tasks = readTasks();

    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

    if(taskIndex === -1){
        return res.status(404).json({error:'Task not found'})
    }

    const updateTask = {
        ...tasks[taskIndex],
        title:title ?? tasks[taskIndex].title,
        description : description ?? tasks[taskIndex].description,
        tag:tag ?? tasks[taskIndex].tag,
        priority:priority ?? tasks[taskIndex].priority,
        status:status ?? tasks[taskIndex].status,

    };

    tasks[taskIndex] = updateTask;
    writeTasks(tasks);

    res.json(updateTask);
});

app.delete('/tasks/:id' ,(req,res) =>{
    const {id}  = req.params;
    let tasks = readTasks();

    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
    if(taskIndex === -1){
        return res.status(404).json({error:'Task not found'})
    }
    const deleteTask = tasks.splice(taskIndex,1);
    writeTasks(tasks);

    res.json(deleteTask[0])

});

app.use((req,res) =>{
    res.status(404).json({error:"Route not found"})
});
app.listen(PORT,() =>{
    console.log(`Server running on http://localhost:${PORT}`)
})