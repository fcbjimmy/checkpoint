const sql = require("mssql");
const { getConnection, update_password } = require("../db/index");
const CustomError = require("../Error");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const showCurrentUser = async (req, res) => {
  const pool = await getConnection();
  const currentUser = await pool
    .request()
    .input("UserId", sql.NVarChar, req.user.UserId)
    .query("SELECT * FROM Users WHERE UserId=@UserId");
  console.log(
    "------------------------------ShowCurrentUser------------------------------"
  );

  console.log(currentUser.recordset[0]);

  res.status(StatusCodes.OK).json({ user: currentUser.recordset[0] });
};

const updateUserPassword = async (req, res) => {
  //get the new password and check whether it has been submitted (throw error)
  //hash password
  //update password in req.user.Password
  //put the hashed password in db
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new CustomError.BadRequestError("Please provide new password value");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("Password", sql.NVarChar, hashedPassword)
    .input("UserId", sql.NVarChar, req.user.UserId)
    .query(update_password);

  if (result.rowsAffected) {
    req.user.Password = hashedPassword;
  }

  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

module.exports = { showCurrentUser, updateUserPassword };
