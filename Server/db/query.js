module.exports = {
  getAllUsers: "SELECT * FROM Users",
  createTest_query:
    "INSERT INTO Testing (Email,Password,Name) VALUES (@Email, @Password, @Name)",
  createUser_query:
    "INSERT INTO Users (UserId, Password, Username, Department, User_Group, Role, Features, Email, Phone, Supervisor, Approver_Leaves_Id, Annual_Balance, Annual_Prebalance, SickLeave_Balance, SickLeave_Prebalance, Active, Createdate, CreateBy, LastLogin, Email_Notification) VALUES (@UserId, @Password, @Username, @Department, @User_Group, @Role, @Features, @Email, @Phone, @Supervisor, @Approver_Leaves_Id, @Annual_Balance, @Annual_Prebalance, @SickLeave_Balance, @SickLeave_Prebalance, @Active, @CreateDate, @CreateBy, @LastLogin, @Email_Notification)",
  get_all_user_groups: "SELECT User_Group FROM Users",
  create_leave_app: "sp_Leave_Create",
  allusergroups: "SELECT * FROM User_Group",
  add_user_group: "INSERT INTO User_Group (Group_Type) VALUES (@Group_Type)",
  updateusergroup: "UPDATE User_Group SET Group_Type=@Group_Type WHERE Id=@Id",
  update_password: "UPDATE Users SET Password=@Password WHERE UserId=@UserId",
  check_existing_user:
    "SELECT UserId, Username, Password, Email, Department, User_Group, Role, Features, Supervisor, Approver_Leaves_Id, Annual_Balance, Annual_Prebalance, SickLeave_Balance, SickLeave_Prebalance FROM Users WHERE UserId=@UserId",
  update_login_time:
    "UPDATE Users SET LastLogin=@LastLogin WHERE UserId=@UserId",
};
