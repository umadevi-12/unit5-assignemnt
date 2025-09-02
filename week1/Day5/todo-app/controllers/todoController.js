const TodoModel = require('../models/todoModel');

class TodoController {
  static getAllTodos(req, res) {
    try {
      const todos = TodoModel.getAll();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static getTodoById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const todo = TodoModel.getById(id);
      
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static createTodo(req, res) {
    try {
      const { title, completed } = req.body;
      
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required and must be a string' });
      }
      
      const newTodo = TodoModel.create({
        title: title.trim(),
        completed: completed || false
      });
      
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static updateTodo(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      if (updates.title && typeof updates.title !== 'string') {
        return res.status(400).json({ error: 'Title must be a string' });
      }
      
      const updatedTodo = TodoModel.update(id, updates);
      
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static deleteTodo(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = TodoModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static searchTodos(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      const results = TodoModel.search(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = TodoController;