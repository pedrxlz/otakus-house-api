const express = require("express");
const router = express.Router();

const { getUser, updateUser } = require("../controllers/userController");

router.get("/user", getUser);
router.put("/user", updateUser);

module.exports = router;
