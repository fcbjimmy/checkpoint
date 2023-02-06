const express = require("express");
const router = express.Router();
const {
  createUser,
  createTest,
  login,
  logout,
} = require("../controllers/auth.controller");
const { create_user_no_auth } = require("../controllers/test.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.route("/createTest").post(createTest);
router.route("/createuserwithoutauth").post(create_user_no_auth);
router
  .route("/register")
  .post([authenticateUser, authorizePermissions("Admin", "HR")], createUser);
router.route("/login").post(login);
router.route("/logout").get(logout);

// router.route("/showCurrentUser").get(authenticateUser, showCurrentUser);

module.exports = router;
