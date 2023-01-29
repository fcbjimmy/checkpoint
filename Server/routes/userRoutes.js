const express = require("express");
const router = express.Router();
const { all_users } = require("../controllers/helper.controller");
const { showCurrentUser, updateUserPassword } = require("../controllers/user.controller");
const { authenticateUser } = require("../middleware/authentication");

router.route("/allusers").get(all_users);
router.route("/showCurrentUser").get(authenticateUser, showCurrentUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
module.exports = router;
