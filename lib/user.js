module.exports = (database) => {
  return (request, response, next) => {
    database.getAllUsers((users) => {
      response.locals.users = users;
      next();
    });
  }
};