const fs = require('fs').promises;
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db.json');

async function readDb() {
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

async function getAllTickets() {
  const db = await readDb();
  return db.tickets || [];
}

async function getTicketById(id) {
  const tickets = await getAllTickets();
  return tickets.find(t => t.id === id);
}

async function createTicket({ title, description, priority, user }) {
  const db = await readDb();
  db.tickets = db.tickets || [];
  const ids = db.tickets.map(t => t.id);
  const nextId = ids.length ? Math.max(...ids) + 1 : 1;
  const newTicket = {
    id: nextId,
    title,
    description,
    priority,
    user,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.tickets.push(newTicket);
  await writeDb(db);
  return newTicket;
}

async function updateTicket(id, updates) {
  const db = await readDb();
  db.tickets = db.tickets || [];
  const idx = db.tickets.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const allowed = ['title', 'description', 'priority'];
  for (const key of allowed) {
    if (key in updates) db.tickets[idx][key] = updates[key];
  }
  db.tickets[idx].updatedAt = new Date().toISOString();
  await writeDb(db);
  return db.tickets[idx];
}

async function deleteTicket(id) {
  const db = await readDb();
  db.tickets = db.tickets || [];
  const idx = db.tickets.findIndex(t => t.id === id);
  if (idx === -1) return false;
  db.tickets.splice(idx, 1);
  await writeDb(db);
  return true;
}

async function resolveTicket(id) {
  const db = await readDb();
  db.tickets = db.tickets || [];
  const idx = db.tickets.findIndex(t => t.id === id);
  if (idx === -1) return null;
  if (db.tickets[idx].status === 'resolved') return db.tickets[idx]; 
  db.tickets[idx].status = 'resolved';
  db.tickets[idx].resolvedAt = new Date().toISOString();
  await writeDb(db);
  return db.tickets[idx];
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  resolveTicket
};
