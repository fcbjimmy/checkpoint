const createTokenUser = (user) => {
  return {
    UserId: user.UserId,
    Email: user.Email,
    Password: user.Password,
    Username: user.Username,
    Department: user.Department,
    User_Group: user.User_Group,
    Role: user.Role,
    Features: user.Features,
    Supervisor: user.Supervisor,
    Approver_Leaves_Id: user.Approver_Leaves_Id,
    Annual_Balance: user.Annual_Balance,
    Annual_Prebalance: user.Annual_Prebalance,
    SickLeave_Balance: user.SickLeave_Balance,
    SickLeave_Prebalance: user.SickLeave_Prebalance,
  };
};

module.exports = createTokenUser;
