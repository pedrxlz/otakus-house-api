const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication.js");
const {
  createBooking,
  getUserBookings,
  getBooking,
} = require("../controllers/bookingController");

router.post("/create", authenticateUser, createBooking);
router.get("/get-bookings", authenticateUser, getUserBookings);
router.get("/get-booking", authenticateUser, getBooking);

module.exports = router;
