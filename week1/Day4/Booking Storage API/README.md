# Simple Book Storage API

A simple **Express.js** application to manage a collection of books using a JSON file (`db.json`) as a database. Supports full CRUD operations and search by author or title with partial matches.

---

## Features

- **Add a new book** (`POST /books`)
- **Get all books** (`GET /books`)
- **Get a book by ID** (`GET /books/:id`)
- **Update a book by ID** (`PUT /books/:id`)
- **Delete a book by ID** (`DELETE /books/:id`)
- **Search books by author or title** (`GET /books/search?author=&title=`)
- **Handles undefined routes** with `404 Not Found`
- Proper HTTP status codes for all operations


