# Ticketing System (Express + db.json) — MVC

## Features
- Store tickets in `db.json`
- GET /tickets, GET /tickets/:id
- POST /tickets (validates required fields: title, description, priority, user)
- PUT /tickets/:id (update title, description, priority)
- DELETE /tickets/:id
- PATCH /tickets/:id/resolve (set status from "pending" to "resolved")
- 404 for undefined routes


