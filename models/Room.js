const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Please provide id"],
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  image: {
    type: String,
    required: [true, "Please provide image"],
    minlength: 3,
    maxlength: 50,
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
    minlength: 3,
    maxlength: 50,
  },
  price: {
    type: String,
    required: [true, "Please provide price"],
    minlength: 3,
    maxlength: 50,
  },
  rating: {
    type: String,
    required: [true, "Please provide rating"],
    minlength: 3,
    maxlength: 50,
  },
  date: {
    type: String,
    required: [true, "Please provide date"],
    minlength: 3,
    maxlength: 50,
  },
});

module.exports = mongoose.model("Room", RoomSchema);
