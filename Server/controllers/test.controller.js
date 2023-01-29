const sql = require("mssql");
const { getConnection, getAllUsers } = require("../db/index");

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

module.exports = { getUser };
