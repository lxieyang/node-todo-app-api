var env = process.env.NODE_ENV || 'development';

const localhostPort = 3000;

if (env === 'development') {
  process.env.PORT = localhostPort;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = localhostPort;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}