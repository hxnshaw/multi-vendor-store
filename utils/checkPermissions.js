const CustomError = require("../errors");

//Ensure that the user who created the review is the only one that can update and delete it. (Admin has access too)
const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to carryout this operation"
  );
};

module.exports = checkPermissions;
