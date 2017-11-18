const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
      isAsync: true,
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
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {  // remove entire object with matching tokens
      tokens: {token}
    }
  });
};



/*
  Schema.statics => model method
*/
UserSchema.statics.findByToken = function (token) {
  var User = this;  // model
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {    // run code before the sanve event - mongoose middleware
  var user = this;

  // check if the password is modified
  if (user.isModified('password')) {
    // hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;   // override the plain text password
        next();
      });
    });

  } else {
    next();   // move on
  }
});

// User
var User = mongoose.model('User', UserSchema);

module.exports = {User};  // ES6 syntax