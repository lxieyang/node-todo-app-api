const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

/*
{
  email: 'xieyangl@123.com',
  password: 'asdkjfhkjahdfkjahsf',   // not stored in plain text
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

/*
  Schema.methods => instance method
*/

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

/*
  Schema.statics => model method
*/
UserSchema.statics.findByToken = function (token) {
  var User = this;  // model
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();  // equiv to above
  }

  // successfully decoded
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,  // nested document
    'tokens.access': 'auth'
  });

};

// User
var User = mongoose.model('User', UserSchema);

module.exports = {User};  // ES6 syntax