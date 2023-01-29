const getConnection = require("../db/connection");
const {
  getAllUsers,
  createUser_query,
  createTest_query,
  create_leave_app,
  update_password,
  check_existing_user,
  update_login_time,
  add_user_group,
  allusergroups,
  updateusergroup,
} = require("./query");

module.exports = {
  getConnection,
  getAllUsers,
  createUser_query,
  createTest_query,
  create_leave_app,
  update_password,
  check_existing_user,
  update_login_time,
  add_user_group,
  allusergroups,
  updateusergroup,
};
