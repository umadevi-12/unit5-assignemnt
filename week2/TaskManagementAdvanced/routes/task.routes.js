const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');
const { validateCreate, validateUpdate } = require('../middleware/task.middleware');

router.post('/tasks', validateCreate, taskController.createTask);

router.get('/tasks', taskController.getTasks);          
router.get('/tasks/:id', taskController.getTaskById);   

router.patch('/tasks/:id', validateUpdate, taskController.updateTask);
router.delete('/tasks', taskController.deleteTask);

module.exports = router;
