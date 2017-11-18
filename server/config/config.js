const {jsmin} = require('jsmin');   // prepare json file with comments and annotations
var fs = require('fs');

var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  var config = JSON.parse(jsmin(fs.readFileSync(__dirname + '/config.json').toString()));  // auto parsed as javascript object
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];  // setting PORT, MONGODB_URI, JWT_SECRET as the environment variable
  });
}


// const localhostPort = 3000;

// if (env === 'development') {
//   process.env.PORT = localhostPort;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = localhostPort;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }