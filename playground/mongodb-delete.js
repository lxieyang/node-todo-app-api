// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');   // object destructing

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connect to MongoDB server');

  // deleteMany
  db.collection('Todos').deleteMany({
    text: 'Eat lunch'
  }).then((result) => {
    console.log(result);
  });


  // deleteOne
  db.collection('Todos').deleteOne({
    text: 'Eat lunch'
  }).then((results) => {
    console.log(results);
  });

  // findOneAndDelete
  db.collection('Todos').findOneAndDelete({
    completed: true
  }).then((results) => {
    console.log(results);
  });

  db.close();
});
