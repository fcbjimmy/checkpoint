const { StatusCodes } = require("http-status-codes");
const sql = require("mssql");
const {
  getConnection,
  add_user_group,
  allusergroups,
  updateusergroup,
  createUser_query,
} = require("../db/index");
const CustomError = require("../Error");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const bcrypt = require("bcryptjs");

//HR controller
//Create User_Group create, update, delete
// Leave type depend on the User_Group e.g. female has maternal
//HR create/edit/delete/update leave types

const add_user = async (req, res) => {
  console.log(req.body);
  const {
    userId,
    password,
    username,
    department,
    user_group,
    role,
    features,
    email,
    phone,
    supervisor,
    approver_leaves_id,
    annual_balance,
    annual_prebalance,
    sickLeave_balance,
    sickLeave_prebalance,
    active,
    createBy,
    email_notification,
  } = req.body;

  const pool = await getConnection();

  const checkExistingUserId = await pool
    .request()
    .input("UserId", sql.NVarChar, userId)
    .query("SELECT UserId FROM Users WHERE UserId=@UserId");

  if (checkExistingUserId.recordset[0]) {
    throw new CustomError.BadRequestError("UserId already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool
    .request()
    .input("UserId", sql.NVarChar, userId)
    .input("Password", sql.Char, hashedPassword)
    .input("Username", sql.NVarChar, username)
    .input("Department", sql.NVarChar, department)
    .input("User_Group", sql.NVarChar, user_group)
    .input("Role", sql.NVarChar, role)
    .input("Features", sql.NVarChar, features)
    .input("Email", sql.NVarChar, email)
    .input("Phone", sql.NVarChar, phone)
    .input("Supervisor", sql.NVarChar, supervisor)
    .input("Approver_Leaves_Id", sql.NVarChar, approver_leaves_id)
    .input("Annual_Balance", sql.Float, annual_balance)
    .input("Annual_Prebalance", sql.Float, annual_prebalance)
    .input("SickLeave_Balance", sql.Float, sickLeave_balance)
    .input("SickLeave_Prebalance", sql.Float, sickLeave_prebalance)
    .input("Active", sql.Bit, active === "true")
    .input("CreateDate", sql.DateTime, new Date())
    .input("CreateBy", sql.NVarChar, createBy)
    .input("LastLogin", sql.DateTime, new Date())
    .input("Email_Notification", sql.Bit, email_notification === "true")
    .query(createUser_query);
  // // res.json(result.recordset);

  const user = {
    UserId: userId,
    Email: email,
    Password: hashedPassword,
    Username: username,
    Department: department,
    User_Group: user_group,
    Role: role,
    Features: features,
    Supervisor: supervisor,
    Approver_Leaves_Id: approver_leaves_id,
    Annual_Balance: annual_balance,
    Annual_Prebalance: annual_prebalance,
    SickLeave_Balance: sickLeave_balance,
    SickLeave_Prebalance: sickLeave_prebalance,
  };

  // const tokenUser = createTokenUser(user);

  // //attachcookiestoresponse
  // attachCookiesToResponse({ res, user: tokenUser });

  const currentUser = await pool
    .request()
    .input("UserId", sql.NVarChar, userId)
    .query("SELECT * FROM Users WHERE UserId=@UserId");

  res.status(StatusCodes.OK).json({ user: currentUser.recordset[0] });
};

const edit_user = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    username,
    department,
    user_group,
    role,
    features,
    email,
    phone,
    supervisor,
    approver_leaves_id,
    annual_balance,
    annual_prebalance,
    sickLeave_balance,
    sickLeave_prebalance,
    active,
    email_notification,
  } = req.body;

  if (!id) {
    throw new CustomError.BadRequestError("No user has been selected");
  }

  const pool = await getConnection();
  const userExist = await pool
    .request()
    .input("Id", sql.NVarChar, id)
    .query("SELECT * FROM Users WHERE Id=@Id");

  if (userExist.rowsAffected[0] === 0) {
    throw new CustomError.BadRequestError("User does not exist");
  }

  const result = await pool
    .request()
    .input("Id", sql.NVarChar, id)
    .input("UserId", sql.NVarChar, userId)
    .input("Username", sql.NVarChar, username)
    .input("Department", sql.NVarChar, department)
    .input("User_Group", sql.NVarChar, user_group)
    .input("Role", sql.NVarChar, role)
    .input("Features", sql.NVarChar, features)
    .input("Email", sql.NVarChar, email)
    .input("Phone", sql.NVarChar, phone)
    .input("Supervisor", sql.NVarChar, supervisor)
    .input("Approver_Leaves_Id", sql.NVarChar, approver_leaves_id)
    .input("Annual_Balance", sql.Float, annual_balance)
    .input("Annual_Prebalance", sql.Float, annual_prebalance)
    .input("SickLeave_Balance", sql.Float, sickLeave_balance)
    .input("SickLeave_Prebalance", sql.Float, sickLeave_prebalance)
    .input("Active", sql.Bit, active === "true")
    .input("Email_Notification", sql.Bit, email_notification === "true")
    .query(
      "UPDATE Users SET Username=@Username,Department=@Department,User_Group=@User_Group,Role=@Role,Features=@Features,Email=@Email,Phone=@Phone,Supervisor=@Supervisor,Approver_Leaves_Id=@Approver_Leaves_Id,Annual_Balance=@Annual_Balance,Annual_Prebalance=@Annual_Prebalance,SickLeave_Balance=@SickLeave_Balance,SickLeave_Prebalance=@SickLeave_Prebalance,Active=@Active,Email_Notification=@Email_Notification WHERE Id=@Id"
    );

  res.json({ msg: "User Edited" });
};

const all_user_group = async (req, res) => {
  const pool = await getConnection();

  const result = await pool.request().query(allusergroups);

  res.json({ User_Groups: result.recordset });
};

const create_user_group = async (req, res) => {
  const { user_group } = req.body;

  if (!user_group) {
    throw new CustomError.BadRequestError("Please provide User Group value");
  }
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("Group_Type", sql.NVarChar, user_group)
    .query(add_user_group);

  res.json({ msg: "User Group created" });
  // console.log(result);
};

const update_user_group = async (req, res) => {
  //need to get the Id from front-end
  const { id } = req.params;
  console.log("------------------------------ID------------------------------");
  console.log(id);
  const { new_user_group } = req.body;
  if (!id || !new_user_group) {
    throw new CustomError.BadRequestError("Please provide valid values");
  }

  const pool = await getConnection();

  const result = await pool
    .request()
    .input("Id", sql.Int, id)
    .input("Group_Type", sql.NVarChar, new_user_group)
    .query(updateusergroup);
  console.log(result);
  res.json({ msg: "User Group Edited" });
  // console.log(result);
};

const delete_user_group = async (req, res) => {
  //need to get the Id from front-end
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Please provide valid value");
  }

  const pool = await getConnection();

  const result = await pool
    .request()
    .input("Id", sql.Int, id)
    .query("DELETE FROM User_Group WHERE Id=@Id");

  console.log(result);
  res.json({ msg: "User Group Deleted" });
  // console.log(result);
};

/////////////////////////////////////////////////////////////////////////////////////
const all_leave_type = async (req, res) => {
  const pool = await getConnection();

  const result = await pool.request().query("SELECT * FROM Leave_Type");

  res.json({ Leave_Types: result.recordset });
};

const create_leave_type = async (req, res) => {
  const {
    leave_code,
    description,
    hr_approval_required,
    balance_addition,
    balance_addition_type,
    balance_deduction,
    balance_deduction_type,
    minimal_balance_required,
    minimal_day_required,
    within_month,
    within_period,
    user_group,
    supporting_documents,
    active,
  } = req.body;

  if (
    !leave_code ||
    !description ||
    !hr_approval_required ||
    !balance_addition ||
    !balance_addition_type ||
    !balance_deduction ||
    !balance_deduction_type ||
    !minimal_balance_required ||
    !minimal_day_required ||
    !within_month ||
    !within_period ||
    !user_group ||
    !supporting_documents ||
    !active
  ) {
    throw new CustomError.BadRequestError(
      "Please provide all values requested"
    );
  }
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("Leave_Code", sql.NVarChar, leave_code)
    .input("Description", sql.NVarChar, description)
    .input("HR_Approval_Required", sql.Bit, hr_approval_required === "true")
    .input("Balance_Addition", sql.Bit, balance_addition === "true")
    .input("Balance_Addition_Type", sql.NVarChar, balance_addition_type)
    .input("Balance_Deduction", sql.Bit, balance_deduction === "true")
    .input("Balance_Deduction_Type", sql.NVarChar, balance_deduction_type)
    .input("Minimal_Balance_Required", sql.Float, minimal_balance_required)
    .input("Minimal_Day_Required", sql.Float, minimal_day_required)
    .input("Within_Month", sql.Int, within_month)
    .input("Within_Period", sql.Int, within_period)
    .input("User_Group", sql.NVarChar, user_group)
    .input(
      "Supporting_Documents_Required",
      sql.Bit,
      supporting_documents === "true"
    )
    .input("Active", sql.Bit, active === "true")
    .query(
      "INSERT INTO Leave_Type (Leave_Code,Description,HR_Approval_Required,Balance_Addition,Balance_Addition_Type,Balance_Deduction,Balance_Deduction_Type,Minimal_Balance_Required,Minimal_Day_Required,Within_Month,Within_Period,User_Group,Supporting_Documents_Required,Active) VALUES (@Leave_Code, @Description, @HR_Approval_Required, @Balance_Addition,@Balance_Addition_Type, @Balance_Deduction,@Balance_Deduction_Type,@Minimal_Balance_Required,@Minimal_Day_Required,@Within_Month,@Within_Period,@User_Group,@Supporting_Documents_Required,@Active)"
    );

  res.json({ msg: "Leave Type Created" });
};

const edit_leave_type = async (req, res) => {
  const { id } = req.params;
  const {
    leave_code,
    description,
    hr_approval_required,
    balance_addition,
    balance_addition_type,
    balance_deduction,
    balance_deduction_type,
    minimal_balance_required,
    minimal_day_required,
    within_month,
    within_period,
    user_group,
    supporting_documents,
  } = req.body;

  if (
    !id ||
    !leave_code ||
    !description ||
    !hr_approval_required ||
    !balance_addition ||
    !balance_addition_type ||
    !balance_deduction ||
    !balance_deduction_type ||
    !minimal_balance_required ||
    !minimal_day_required ||
    !within_month ||
    !within_period ||
    !user_group ||
    !supporting_documents
  ) {
    throw new CustomError.BadRequestError("Please provide valid values");
  }
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("Id", sql.Int, id)
    .input("Leave_Code", sql.NVarChar, leave_code)
    .input("Description", sql.NVarChar, description)
    .input("HR_Approval_Required", sql.Bit, hr_approval_required === "true")
    .input("Balance_Addition", sql.Bit, balance_addition === "true")
    .input("Balance_Addition_Type", sql.NVarChar, balance_addition_type)
    .input("Balance_Deduction", sql.Bit, balance_deduction === "true")
    .input("Balance_Deduction_Type", sql.NVarChar, balance_deduction_type)
    .input("Minimal_Balance_Required", sql.Float, minimal_balance_required)
    .input("Minimal_Day_Required", sql.Float, minimal_day_required)
    .input("Within_Month", sql.Int, within_month)
    .input("Within_Period", sql.Int, within_period)
    .input("User_Group", sql.NVarChar, user_group)
    .input(
      "Supporting_Documents_Required",
      sql.Bit,
      supporting_documents === "true"
    )
    .query(
      "UPDATE Leave_Type SET Leave_Code=@Leave_Code,Description=@Description,HR_Approval_Required=@HR_Approval_Required,Balance_Addition=@Balance_Addition,Balance_Addition_Type=@Balance_Addition_Type,Balance_Deduction=@Balance_Deduction,Balance_Deduction_Type=@Balance_Deduction_Type,Minimal_Balance_Required=@Minimal_Balance_Required,Minimal_Day_Required=@Minimal_Day_Required,Within_Month=@Within_Month,Within_Period=@Within_Period,User_Group=@User_Group,Supporting_Documents_Required=@Supporting_Documents_Required WHERE Id=@Id"
    );

  console.log(result);
  res.status(StatusCodes.OK).json({ msg: "Leave Type Edited" });
};

const deactivate_leave_type = async (req, res) => {
  //need to get the Id from front-end
  const { id } = req.params;
  const { active } = req.body;

  if (!id || !active) {
    throw new CustomError.BadRequestError("Please provide valid values");
  }

  const pool = await getConnection();

  const result = await pool
    .request()
    .input("Id", sql.Bit, id)
    .input("Active", sql.Bit, active === "true")
    .query("UPDATE Leave_Type SET Active=@Active WHERE Id=@Id");

  console.log(result);
  res.json({
    msg: `Leave Type ${active === "true" ? "activated" : "deactivated"}`,
  });
  // console.log(result);
};

module.exports = {
  create_user_group,
  all_user_group,
  update_user_group,
  delete_user_group,
  create_leave_type,
  all_leave_type,
  edit_leave_type,
  deactivate_leave_type,
  add_user,
  edit_user,
};
