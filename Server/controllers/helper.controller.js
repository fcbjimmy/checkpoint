const sql = require("mssql");
const {
  getConnection,
  getAllUsers,
  createUser_query,
  createTest_query,
} = require("../db/index");
const { StatusCodes } = require("http-status-codes");

//get all users 
//get all supervisors
//get all HR
//get all User_groups
//get all leave types

const all_users = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query(getAllUsers);
  // res.json(result.recordset);
  console.log(result);
  res.json(result.recordset);
};

const all_supervisors = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .query("SELECT Username, UserId FROM Users WHERE Role='Supervisor'");
  // res.json(result.recordset);
  res.json(result.recordset);
};

const all_hr = async (req, res) => {
  const pool = await getConnection();
  const result = await pool
    .request()
    .query("SELECT Username, UserId FROM Users WHERE Role='HR'");
  // res.json(result.recordset);
  res.json(result.recordset);
};

const all_user_groups = async (req, res) => {};

const all_leave_types = async (req, res) => {};

module.exports = {
  all_users,
  all_supervisors,
  all_hr,
  all_user_groups,
  all_leave_types,
};
