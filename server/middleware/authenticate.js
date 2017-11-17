var {User} = require('./../models/user');

// middleware function to take care of authentication
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');   // get the header field

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();  // jump to catch block
    }

    // modify req Object
    req.user = user;
    req.token = token;
    next();   // execute response code
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};