const payloadCheck = (req, res, next) => {
  if (req.body.username && req.body.password) {
    console.log(req.body);
    next();
  } else {
    next({status: 400, message: 'username and password required'});
  }
}

module.exports = {
  payloadCheck
}