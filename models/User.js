const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  telefone: {
    type: String,
    required: [true, "Please provide telefone"],
    minlength: 11,
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
});

module.exports = mongoose.model("User", UserSchema);
