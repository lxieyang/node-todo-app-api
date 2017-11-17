const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const usersList = [{
  _id: userOneId, 
  email: 'andrew@asdlk.cj',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'alsfk@jsd.com',
  password: 'userTwoPass'
}];

const todosList = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todosList);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(usersList[0]).save();  // middleware will run
    var userTwo = new User(usersList[1]).save();  // middleware will run

    return Promise.all([userOne, userTwo]).then(() => {
      done();
    });
  }); 
};

module.exports = {todosList, populateTodos, usersList, populateUsers};