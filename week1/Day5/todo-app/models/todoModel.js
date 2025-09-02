const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

class TodoModel {
  static readData() {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { todos: [], nextId: 1 };
    }
  }

  static writeData(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }

  static getAll() {
    const db = this.readData();
    return db.todos;
  }

  static getById(id) {
    const db = this.readData();
    return db.todos.find(todo => todo.id === id);
  }

  static create(todo) {
    const db = this.readData();
    const newTodo = {
      id: db.nextId++,
      title: todo.title,
      completed: todo.completed || false,
      createdAt: new Date().toISOString()
    };
    db.todos.push(newTodo);
    this.writeData(db);
    return newTodo;
  }

  static update(id, updates) {
    const db = this.readData();
    const todoIndex = db.todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) return null;
    
    db.todos[todoIndex] = { ...db.todos[todoIndex], ...updates };
    this.writeData(db);
    return db.todos[todoIndex];
  }

  static delete(id) {
    const db = this.readData();
    const todoIndex = db.todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) return false;
    
    db.todos.splice(todoIndex, 1);
    this.writeData(db);
    return true;
  }

  static search(query) {
    const db = this.readData();
    const searchTerm = query.toLowerCase();
    return db.todos.filter(todo => 
      todo.title.toLowerCase().includes(searchTerm)
    );
  }
}

module.exports = TodoModel;