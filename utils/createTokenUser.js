const createTokenUser = (user) => {
  return {
    username: user.name,
    first_name: user.first_name,
    last_name: user.last_name,
    userId: user._id,
    role: user.role,
    email: user.email,
  };
};

module.exports = createTokenUser;
