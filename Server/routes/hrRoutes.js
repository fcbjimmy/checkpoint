const express = require("express");
const router = express.Router();
const {
  all_user_group,
  create_user_group,
  update_user_group,
  delete_user_group,
  create_leave_type,
  all_leave_type,
  edit_leave_type,
  deactivate_leave_type,
} = require("../controllers/hr.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//User_Groups
router.route("/allusergroups").get(authenticateUser, all_user_group);
router
  .route("/addusergroup")
  .post([authenticateUser, authorizePermissions("HR")], create_user_group);

router
  .route("/usergroup/:id")
  .patch([authenticateUser, authorizePermissions("HR")], update_user_group)
  .delete([authenticateUser, authorizePermissions("HR")], delete_user_group);
// router.route("/updateusergroup").patch(authenticateUser, update_user_group);
// router.route("/deleteusergroup").delete(authenticateUser, delete_user_group);

//Leave_Types
router.route("/allleavetypes").get(authenticateUser, all_leave_type);

router
  .route("/addleavetype")
  .post([authenticateUser, authorizePermissions("HR")], create_leave_type);

router
  .route("/leavetype/:id")
  .patch([authenticateUser, authorizePermissions("HR")], edit_leave_type);

router
  .route("/toggleleavetype/:id")
  .patch([authenticateUser, authorizePermissions("HR")], deactivate_leave_type);

module.exports = router;
