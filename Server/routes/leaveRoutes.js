const express = require("express");
const router = express.Router();
const { createLeave } = require("../controllers/leave.controller");
const { authenticateUser } = require("../middleware/authentication");

router.route("/createLeave").post(authenticateUser, createLeave);

module.exports = router;
