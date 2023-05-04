const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, telefone, address } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, telefone, address },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUser,
  updateUser,
};
