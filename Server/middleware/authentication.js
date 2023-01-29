const CustomError = require("../Error");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication is Invalid");
  }

  try {
    const payload = isTokenValid({ token });

    req.user = {
      UserId: payload.UserId,
      Email: payload.Email,
      Password: payload.Password,
      Username: payload.Username,
      Department: payload.Department,
      User_Group: payload.User_Group,
      Role: payload.Role,
      Features: payload.Features,
      Supervisor: payload.Supervisor,
      Approver_Leaves_Id: payload.Approver_Leaves_Id,
      Annual_Balance: payload.Annual_Balance,
      Annual_Prebalance: payload.Annual_Prebalance,
      SickLeave_Balance: payload.SickLeave_Balance,
      SickLeave_Prebalance: payload.SickLeave_Prebalance,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication is Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.Role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
