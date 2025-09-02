const ticketModel = require('../models/ticketModel');

async function getAll(req, res, next) {
  try {
    const tickets = await ticketModel.getAllTickets();
    res.json(tickets);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const ticket = await ticketModel.getTicketById(id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, description, priority, user } = req.body;
    const newTicket = await ticketModel.createTicket({ title, description, priority, user });
    res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const updated = await ticketModel.updateTicket(id, updates);
    if (!updated) return res.status(404).json({ error: "Ticket not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const deleted = await ticketModel.deleteTicket(id);
    if (!deleted) return res.status(404).json({ error: "Ticket not found" });
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    next(err);
  }
}

async function resolve(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const resolved = await ticketModel.resolveTicket(id);
    if (!resolved) return res.status(404).json({ error: "Ticket not found" });
    res.json(resolved);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  resolve
};
