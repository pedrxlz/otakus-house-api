const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/forget-password", forgetPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
