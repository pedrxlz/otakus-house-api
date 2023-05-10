const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  const { user, room, checkinDate, checkoutDate, guests } = req.body;

  try {
    const booking = await Booking.create({
      user,
      room,
      checkinDate,
      checkoutDate,
      guests,
    });
    res.json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ user: userId });
    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
};
