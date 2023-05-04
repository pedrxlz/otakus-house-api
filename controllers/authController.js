const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function hashPassword(plainPassword) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return hashedPassword;
  } catch (error) {
    console.error(error);
  }
}

async function comparePasswords(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
  } catch (error) {
    console.error(error);
  }
}

const register = async (req, res) => {
  const { name, email, password, telefone, address } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      telefone,
      address,
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isMatch = await comparePasswords(password, user.password);
    const token = jwt.sign({ id: user._id }, "secret", {
      expiresIn: "1h",
    });
    res.json({ Valid: isMatch, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const logout = async (req, res) => {};

module.exports = {
  register,
  login,
  logout,
};
