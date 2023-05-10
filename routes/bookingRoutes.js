const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication.js");
const {
  createBooking,
  getUserBookings,
} = require("../controllers/bookingController");

router.post("/create", authenticateUser, createBooking);
router.get("/get-bookings", authenticateUser, getUserBookings);

module.exports = router;
