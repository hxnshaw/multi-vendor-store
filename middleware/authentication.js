const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  //Check if token exists.
  if (!token) {
    throw new CustomError.BadRequestError("Authentication Invalid.");
  }

  try {
    const { userId, username, role, email,first_name, last_name} = isTokenValid({ token });
    req.user = { userId, username, role, email,first_name, last_name };
    next();
  } catch (error) {
    throw new CustomError.BadRequestError("Authentication Invalid.");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route."
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
