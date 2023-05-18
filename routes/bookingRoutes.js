const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication.js");
const {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  editBooking,
} = require("../controllers/bookingController");

router.post("/create", authenticateUser, createBooking);
router.get("/get-bookings", authenticateUser, getUserBookings);
router.get("/get-booking", authenticateUser, getBooking);
router.put("/update-booking", authenticateUser, editBooking);
router.delete("/cancel-booking", authenticateUser, cancelBooking);

module.exports = router;
