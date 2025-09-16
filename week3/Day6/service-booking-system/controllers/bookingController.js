
const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      user: req.user.id,
      serviceName: req.body.serviceName,
      requestedDateTime: req.body.requestedDateTime,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === "admin") {
      bookings = await Booking.find().populate("user", "username email");
    } else {
      bookings = await Booking.find({ user: req.user.id });
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.id || booking.status !== "pending") {
      return res.status(403).json({ message: "Cannot update this booking" });
    }
    booking.serviceName = req.body.serviceName || booking.serviceName;
    booking.requestedDateTime = req.body.requestedDateTime || booking.requestedDateTime;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (req.user.role === "admin" || (booking.user.toString() === req.user.id && booking.status === "pending")) {
      booking.status = "cancelled";
      await booking.save();
      res.json({ message: "Booking cancelled" });
    } else {
      res.status(403).json({ message: "Cannot cancel this booking" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "approved";
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "rejected";
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
