const bcrypt = require("bcryptjs");

const comparePassword = async (canditatePassword, password) => {
  const validPassword = await bcrypt.compare(canditatePassword, password);
  return validPassword;
};

module.exports = comparePassword;
