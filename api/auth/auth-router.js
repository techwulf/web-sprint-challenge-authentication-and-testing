const bcrypt = require('bcryptjs');
const router = require('express').Router();

const Users = require('./auth-model');
const {
  payloadCheck, 
  checkUsername,
  checkIfUser,
} = require('./auth-middleware');
const buildToken = require('./token-builder');

router.post('/register', payloadCheck, checkUsername, (req, res, next) => {
  const user = req.body;
  const rounds = process.env.BCRYPT_ROUNDS || 6;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(next);
});

router.post('/login', payloadCheck, checkIfUser, (req, res, next) => {
  const {username, password} = req.body;
  if (username && bcrypt.compareSync(password, req.user.password)) {
    const token = buildToken(req.user);
    res.status(200).json({
      message: `welcome, ${req.user.username}`,
      token
    });
  } else {
    next({status: 401, message: 'invalid credentials'});
  }
});

module.exports = router;
