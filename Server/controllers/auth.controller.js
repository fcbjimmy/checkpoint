const sql = require("mssql");
const {
  getConnection,
  getAllUsers,
  createUser_query,
  createTest_query,
  check_existing_user,
  update_login_time,
} = require("../db/index");
const CustomError = require("../Error");
const {
  createTokenUser,
  attachCookiesToResponse,
  comparePassword,
} = require("../utils");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const createTest = async (req, res) => {
  const { email, password, name } = req.body;
  console.log(req.body);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("Email", sql.NVarChar, email)
    .input("Password", sql.NVarChar, password)
    .input("Name", sql.NVarChar, name)
    .query(createTest_query);
  // res.json(result.recordset);
  console.log(result);
  res.json(result);

  // console.log(req.body);
  // res.json(req.body);
};

const createUser = async (req, res) => {
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

  const tokenUser = createTokenUser(user);

  //attachcookiestoresponse
  attachCookiesToResponse({ res, user: tokenUser });

  const currentUser = await pool
    .request()
    .input("UserId", sql.NVarChar, userId)
    .query("SELECT * FROM Users WHERE UserId=@UserId");

  res.status(StatusCodes.OK).json({ user: currentUser.recordset[0] });
};

const login = async (req, res) => {
  // Check userId and password whether there are empty
  // Check whether userId exists in db
  // Compare the Passwords
  // Create Token
  // If all ok, attachCookies to response
  // Mind the uppercase / password as hashedpassword

  const { userId, password } = req.body;

  if (!userId || !password) {
    throw new CustomError.BadRequestError(
      "Please provide valid user id and password"
    );
  }

  const pool = await getConnection();

  const checkExistingUser = await pool
    .request()
    .input("UserId", sql.NVarChar, userId)
    .query(check_existing_user);

  if (!checkExistingUser.recordset[0]) {
    throw new CustomError.BadRequestError("User does not exists");
  }

  const validPassword = await comparePassword(
    password,
    checkExistingUser.recordset[0].Password
  );

  if (!validPassword) {
    throw new CustomError.UnauthenticatedError("Password does not match");
  }

  const tokenUser = createTokenUser(checkExistingUser.recordset[0]);
  attachCookiesToResponse({ res, user: tokenUser });

  const update_LastLogin = await pool
    .request()
    .input("UserId", sql.NVarChar, userId)
    .input("LastLogin", sql.DateTime, new Date())
    .query(update_login_time);

  const currentUser = await pool
    .request()
    .input("UserId", sql.NVarChar, userId)
    .query("SELECT * FROM Users WHERE UserId=@UserId");

  res.status(StatusCodes.OK).json({ user: currentUser.recordset[0] });
};

const logout = async (req, res) => {
  //remove cookie
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()), // remove cookie from browser
  }); //same name as 'token' from attachCookiesToResponse

  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = { createUser, createTest, login, logout };
