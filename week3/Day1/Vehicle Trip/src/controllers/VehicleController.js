const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id);

exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = new Vehicle(req.body);
    const saved = await vehicle.save();
    res.status(201).json({ message: 'Vehicle created', vehicle: saved });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'registrationNumber must be unique' });
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
};

exports.getAllVehicles = async (_, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.json({ count: vehicles.length, vehicles });
  } catch (err) { next(err); }
};

exports.getVehicleById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid vehicle id' });
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) { next(err); }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Updated', vehicle: updated });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'registrationNumber must be unique' });
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Deleted', vehicle: deleted });
  } catch (err) { next(err); }
};


exports.addTrip = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    vehicle.trips.push(req.body);
    await vehicle.save();
    res.status(201).json({ message: 'Trip added', trip: vehicle.trips.at(-1) });
  } catch (err) { next(err); }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    const trip = vehicle.trips.id(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    Object.assign(trip, req.body);
    await vehicle.save();
    res.json({ message: 'Trip updated', trip });
  } catch (err) { next(err); }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    const trip = vehicle.trips.id(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    trip.remove();
    await vehicle.save();
    res.json({ message: 'Trip deleted' });
  } catch (err) { next(err); }
};

exports.getVehiclesWithLongTrip = async (req, res, next) => {
  try {
    const min = Number(req.query.minDistance) || 200;
    const vehicles = await Vehicle.find({ 'trips.distance': { $gt: min } });
    res.json({ count: vehicles.length, vehicles });
  } catch (err) { next(err); }
};

exports.getVehiclesByStartLocations = async (req, res, next) => {
  try {
    const locations = (req.query.locations || '').split(',').filter(Boolean);
    const vehicles = await Vehicle.find({ 'trips.startLocation': { $in: locations } });
    res.json({ count: vehicles.length, vehicles });
  } catch (err) { next(err); }
};

exports.getVehiclesWithTripsStartingAfter = async (req, res, next) => {
  try {
    const date = new Date(req.query.date || '2024-01-01');
    const vehicles = await Vehicle.find({ 'trips.startTime': { $gt: date } });
    res.json({ count: vehicles.length, vehicles });
  } catch (err) { next(err); }
};

exports.getVehiclesByTypes = async (req, res, next) => {
  try {
    const types = (req.query.types || '').split(',').filter(Boolean);
    const vehicles = await Vehicle.find({ type: { $in: types } });
    res.json({ count: vehicles.length, vehicles });
  } catch (err) { next(err); }
};

exports.getTotalDistance = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ vehicleId: req.params.id, totalDistance: vehicle.totalDistance() });
  } catch (err) { next(err); }
};
