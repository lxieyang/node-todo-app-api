var mongoose = require('mongoose');

// Todo
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,  // validation
    minlength: 1,   // string length
    trim: true  // remove leading and trailing space
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = { Todo };