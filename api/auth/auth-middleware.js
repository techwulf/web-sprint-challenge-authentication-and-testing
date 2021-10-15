const db = require('../../data/dbConfig');

const payloadCheck = (req, res, next) => {
  if (req.body.username && req.body.password) {
    console.log(req.body);
    next();
  } else {
    next({status: 400, message: 'username and password required'});
  }
}

const checkUsername = async (req, res, next) => {
  const [checkIfUser] = await db('users').where('username', req.body.username);
  if (checkIfUser) {
    next({status: 400, message: 'username taken'});
  } else {
    next();
  }
}

const checkIfUser = async (req, res, next) => {
  const [user] = await db('users').where('username', req.body.username);
  if (user) {
    req.user = user;
    next();
  } else {
    next({status: 401, message: 'invalid credentials'});
  }
}

module.exports = {
  payloadCheck,
  checkUsername,
  checkIfUser
}