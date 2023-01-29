const express = require("express");
const router = express.Router();
const { all_supervisors, all_hr } = require("../controllers/helper.controller");

router.route("/all_supervisors").get(all_supervisors);
router.route("/all_hr").get(all_hr);

// router.route("/showCurrentUser").get(authenticateUser, showCurrentUser);

module.exports = router;
