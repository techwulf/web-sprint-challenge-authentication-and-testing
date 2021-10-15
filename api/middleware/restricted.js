const jwt = require('jsonwebtoken');

const {JWT_SECRET} = require("../../config");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next({status: 401, message: 'token required'});
  } 

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({status: 401, message: 'token invalid'});
    } else {
      next();
    }
  });
};
