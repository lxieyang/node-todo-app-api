const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  console.log(salt);
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);  // notice that the salt is prepended to the hash
  });
});

var hashedPassword = '$2a$10$8bl8d.NFIO2DTEBdUeTH/e7JZkqbYL7ZN3a9XikunH4Y6QAvuoVdW';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});