require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// middleware
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;  // on heroku use the former, localhost use the latter

app.use(bodyParser.json());   // body-parser middleware


/**** create todos ****/
// app.post('/todos', authenticate, (req, res) => {
//   var todo = new Todo({
//     text: req.body.text,
//     _creator: req.user._id  // from the 'authenticate' middleware
//   });

//   todo.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

app.post('/todos', authenticate, async (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id  // from the 'authenticate' middleware
  });

  try {
    const doc = await todo.save();    
    res.send(doc);
  } catch (error) {
    res.status(400).send(error);
  }
});


/**** list todos ****/
// app.get('/todos', authenticate, (req, res) => {
//   Todo.find({
//     _creator: req.user._id
//   }).then((todos) => {
//     res.send({
//       todos
//     });
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

app.get('/todos', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({
      _creator: req.user._id
    });
    res.send({todos});
  } catch (error) {
    res.status(400).send(error);
  }
});


/**** get individual todo ****/
// app.get('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;

//   if(!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   Todo.findOne({
//     _id: id,
//     _creator: req.user._id
//   }).then((todo) => {
//     if(!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

app.get('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOne({
      _id: id,
      _creator: req.user._id
    }); 

    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  } catch (error) {
    res.status(400).send();
  }
});


/**** delete individual todo ****/
// app.delete('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   Todo.findOneAndRemove({
//     _id: id,
//     _creator: req.user._id
//   }).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

app.delete('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (!todo) {
      return res.status(404).send();
    }
  
    res.send({todo});
  } catch (error) {
    res.status(400).send();
  }

});


/**** update individual todo ****/
// app.patch('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//   var body = _.pick(req.body, ['text', 'completed']);

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }

//   Todo.findOneAndUpdate({
//     _id: id,
//     _creator: req.user._id
//   }, {
//     $set: body
//   }, {
//     new: true   // like returnOriginal, but in Mongoose
//   }).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

app.patch('/todos/:id', authenticate, async (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  try {
    const todo = await Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {
      $set: body
    }, {
      new: true   // like returnOriginal, but in Mongoose
    });

    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  } catch (error) {
    res.status(400).send();
  }
});


/**** sign up users ****/
// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);

//   user.save().then(() => {
//     return user.generateAuthToken();  // return a promise, which is a token
//   }).then((token) => {
//     res.header('x-auth', token).send(user);
//   }).catch((e) => {
//     res.status(400).send(e);
//   });
// });

app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});


/**** get user info ****/
app.get('/users/me', authenticate, (req, res) => {  // authentication is a middleware
  res.send(req.user);
});


/**** log in users ****/
// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);

//   User.findByCredentials(body.email, body.password).then((user) => {
//     return user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).send(user);
//     });
//   }).catch((e) => {
//     res.status(400).send();   // catch all the Promise.rejects
//   });
// });

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    res.status(400).send();   // catch all the Promise.rejects
  }
});


/**** log out users ****/
// app.delete('/users/me/token', authenticate, (req, res) => {
//   req.user.removeToken(req.token).then(() => {  // intance method
//     res.status(200).send();
//   }, () => {
//     res.status(400).send();
//   });
// });

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};