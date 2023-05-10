const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide userId"],
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Please provide roomId"],
  },
  checkinDate: {
    type: String,
    length: 13,
    required: [true, "Please provide checkinDate"],
  },
  checkoutDate: {
    type: String,
    length: 13,
    required: [true, "Please provide checkoutDate"],
  },
  guests: {
    type: Number,
    required: [true, "Please provide guests"],
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
