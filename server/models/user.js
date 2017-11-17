const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

/*
{
  email: 'xieyangl@123.com',
  password: 'asdkjfhkjahdfkjahsf',   // not in plain text
  tokens: [{
      access: 'auth',
      token: 'jsadfjlkajfdlkjalskjfdklajdflkjadlsdjf',  // send along the http request   
  }]
}
*/

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      // validator: (value) => {
      //   return validator.isEmail(value);
      // },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {   // override toJSON method
  var user = this;
  var userObject = user.toObject();
  
  return _.pick(userObject, ['email', '_id']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

// User
var User = mongoose.model('User', UserSchema);

module.exports = {User};  // ES6 syntax