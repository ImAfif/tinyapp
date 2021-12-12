let emailchecker = (email, users) => {
  for (let userid in users) {
    const user = users[userid];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

module.exports = { emailchecker };
