const sql = require("mssql");
const { getConnection, getAllUsers, createUser_query } = require("../db/index");
const CustomError = require("../Error");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const createUserTable = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(getAllUsers);
    // res.json(result.recordset);
    console.log(result);
    res.json(result.recordset[0]);
  } catch (error) {
    console.log(error);
  }
};

const create_user_no_auth = async (req, res) => {
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

  const tokenUser = createTokenUser(user);

  //attachcookiestoresponse
  attachCookiesToResponse({ res, user: tokenUser });

  const currentUser = await pool
    .request()
    .input("UserId", sql.NVarChar, userId)
    .query("SELECT * FROM Users WHERE UserId=@UserId");

  res.status(StatusCodes.OK).json({ user: currentUser.recordset[0] });
};

module.exports = { create_user_no_auth };
