require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authenticateUser } = require("../middleware/authentication");

const getUser = async (req, res) => {
  const { email } = req.query;

  try {
    await authenticateUser(req, res);
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json(foundUser);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error finding user" });
  }
};

const updateUser = async (req, res) => {
  const { name, telefone, address } = req.body;
  const { email } = req.query;

  try {
    await authenticateUser(req, res);
    const updateUser = await User.findOneAndUpdate(
      { email },
      { name, telefone, address }
    );
    if (!updateUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(updateUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error finding user" });
  }
};

module.exports = {
  getUser,
  updateUser,
};
