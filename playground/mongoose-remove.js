const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove
// Todo.findOneAndRemove
// Todo.findByIdAndRemove


// Todo.remove({}).then((result) => {
//   console.log(result);
// });


Todo.findByIdAndRemove('5a0dd47a69c64cfa69c8ff3b').then((todo) => {
  console.log(todo);
});