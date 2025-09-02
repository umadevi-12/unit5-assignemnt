const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');


router.get('/', TodoController.getAllTodos);

router.get('/:id', TodoController.getTodoById);


router.post('/', TodoController.createTodo);


router.put('/:id', TodoController.updateTodo);

router.delete('/:id', TodoController.deleteTodo);


router.get('/search', TodoController.searchTodos);

module.exports = router;