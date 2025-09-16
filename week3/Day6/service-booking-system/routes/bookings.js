const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createBooking,
  getBookings,
  updateBooking,
  cancelBooking,
  approveBooking,
  rejectBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.use(authenticate);

router.post("/", authorize(["user"]), createBooking);
router.get("/", getBookings);
router.put("/:id", authorize(["user"]), updateBooking);
router.delete("/:id", cancelBooking); 
router.patch("/:id/approve", authorize(["admin"]), approveBooking);
router.patch("/:id/reject", authorize(["admin"]), rejectBooking);
router.delete("/:id/admin", authorize(["admin"]), deleteBooking);

module.exports = router;
