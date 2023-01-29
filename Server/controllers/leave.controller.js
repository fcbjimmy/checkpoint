const sql = require("mssql");
const { getConnection, create_leave_app } = require("../db/index");

const status = ["Pending", "Approved", "Declined"];

const AnnualLeave = {
  leave_code: "LEAVE001",
  description: "Annual Leave",
  hr_approval_required: "true",
  balance_addition: "true",
  balance_addition_type: "Annual Leave",
  balance_deduction: "true",
  balance_deduction_type: "Annual Leave",
  minimal_balance_required: 1,
  minimal_day_required: 1,
  within_month: 2,
  within_period: 2,
  user_group: "permanent,male,female",
  supporting_documents: "false",
};

const SickLeave = {
  leave_code: "LEAVE002",
  description: "Sick Leave",
  hr_approval_required: "true",
  balance_addition: "true",
  balance_addition_type: "Sick Leave",
  balance_deduction: "true",
  balance_deduction_type: "Sick Leave",
  minimal_balance_required: 1,
  minimal_day_required: 1,
  within_month: 2,
  within_period: 2,
  user_group: "permanent,male,female",
  supporting_documents: "false",
};

const createLeave = async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  const {
    status,
    reference_date,
    request_leave_date,
    supporting_documents,
    user_remarks,
    totaldays,
    supervisor_approval_status,
    supervisor_approval_date,
    supervisor_remarks,
    hr_approval_status,
    hr_approval_date,
    hr_remarks,
    leave_code,
  } = req.body;
  const user = req.user;
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("Status", sql.NVarChar, status)
    .input("UserId", sql.NVarChar, user.userId)
    .input("Username", sql.NVarChar, user.username)
    .input("Department", sql.NVarChar, user.department)
    .input("Reference_Date", sql.DateTime, reference_date)
    .input("Request_Leave_Date", sql.DateTime, request_leave_date)
    .input("Supporting_Documents", sql.NVarChar, supporting_documents)
    .input("User_Remarks", sql.NVarChar, user_remarks)
    .input("Submit_Date", sql.DateTime, new Date())
    .input("TotalDays", sql.Float, totaldays)
    .input("ApproverId", sql.NVarChar, req.user.Supervisor)
    .input("Approver_Name", sql.NVarChar, req.user.Approver_Name)
    .input(
      "Supervisor_Approval_Status",
      sql.NVarChar,
      supervisor_approval_status
    )
    .input("Supervisor_Approval_Date", sql.NVarChar, supervisor_approval_date)
    .input("Supervisor_Remarks", sql.NVarChar, supervisor_remarks)
    .input("HR_Approval_Status", sql.NVarChar, hr_approval_status)
    .input("HR_Approval_Date", sql.NVarChar, hr_approval_date)
    .input("HR_Remarks", sql.NVarChar, hr_remarks)
    .input("Leave_Code", sql.NVarChar, leave_code)
    .input("Balance_Addition", sql.Bit, AnnualLeave.balance_addition)
    .input(
      "Balance_Addition_Type",
      sql.NVarChar,
      AnnualLeave.balance_addition_type
    )
    .input("Balance_Deduction", sql.Bit, AnnualLeave.balance_deduction)
    .input(
      "Balance_Deduction_Type".sql.NVarChar,
      AnnualLeave.balance_deduction_type
    )
    .input(
      "Minimal_Balance_Required".sql.Float,
      AnnualLeave.minimal_balance_required
    )
    .input("Minimal_Day_Required", sql.Float, AnnualLeave.minimal_day_required)
    .execute(create_leave_app);
  //res.json(result.recordset);
  // console.log(result);
  res.json({ user: req.user });
  // console.log(result);
};

module.exports = { createLeave };
