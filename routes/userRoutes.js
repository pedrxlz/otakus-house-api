const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication.js");
const { getUser, updateUser } = require("../controllers/userController");

router.get("/", authenticateUser, getUser);
router.put("/", authenticateUser, updateUser);

module.exports = router;
