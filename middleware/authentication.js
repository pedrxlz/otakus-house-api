require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "You are not authorized to perform this action" });
  }

  const token = authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ error: "No user found with this id. Please try again" });
    }

    req.user = user;
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }

  next();
};

module.exports = {
  authenticateUser,
};
