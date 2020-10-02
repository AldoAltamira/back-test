const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/.env') });
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = require('bluebird');
const mongoUrl = process.env.mongoUrl ? process.env.mongoUrl : 'mongodb://localhost/back-test';
mongoose.set('debug', false);

const connection = mongoose.createConnection(mongoUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }, function (err) {
  if (err) {
    console.log('Unable to connect to database', mongoUrl);
  } else {
    console.log('Connection to databse succesful');
  }
});
autoIncrement.initialize(connection);

module.exports = connection;
