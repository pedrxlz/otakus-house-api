const Booking = require("../models/Booking");
require("../models/Room");

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
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserBookings = async (req, res) => {
  const { userId, expired } = req.query;

  const currentDate = new Date();

  try {
    if (expired === "false") {
      const bookings = await Booking.find({
        user: userId,
        checkoutDate: { $gte: currentDate },
      })
        .populate({
          path: "user",
          model: "User",
          select: "name email telefone address",
        })
        .populate({
          path: "room",
          model: "Room",
        });

      return res.json(bookings);
    }
    if (expired === "true") {
      const bookings = await Booking.find({
        user: userId,
        checkoutDate: { $lte: currentDate },
      })
        .populate({
          path: "user",
          model: "User",
          select: "name email telefone address",
        })
        .populate({
          path: "room",
          model: "Room",
        });

      return res.json(bookings);
    } else {
      const bookings = await Booking.find({
        user: userId,
      })
        .populate({
          path: "user",
          model: "User",
          select: "name email telefone address",
        })
        .populate({
          path: "room",
          model: "Room",
        });

      return res.json(bookings);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBooking = async (req, res) => {
  const { id } = req.query;

  try {
    const bookings = await Booking.find({ _id: id })
      .populate({
        path: "user",
        model: "User",
        select: "name email telefone address",
      })
      .populate({
        path: "room",
        model: "Room",
      });

    res.json(bookings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const cancelBooking = async (req, res) => {
  const { id } = req.query;
  try {
    const booking = await Booking.deleteOne({ _id: id });
    return res.json(booking);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
};
