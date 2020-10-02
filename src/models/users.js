'use strict';
const database = require('../database'),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	bcrypt = require('bcryptjs'),
	Schema = mongoose.Schema;
const saltPassword = process.env.saltPassword ? process.env.saltPassword : 4;

let users = new Schema({
	_id: {
		type: Number,
	},
	name: {
		type: String,
		required: [true, 'name is required'],
	},
  email: {
		type: String,
		unique: true,
		validate: {
      validator: function(v) {
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
	},
	phone: {
		type: String
	},
	password: {
		type: String,
		required: [true, 'password is required']
	},
	age: {
		type: Number,
	},
	gender: {
		type: String,
		enum: ['Male', 'Female'],
	},
	hobby: {
		type: String,
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
});

users.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(saltPassword);
    this.password = await bcrypt.hash(this.password, salt);
		console.log('this.email', this.email);
		database.models["users"].findOne({email : this.email},function(error, results) {
      if(error) {
        return next(error);
      } else if(results) { //there was a result found, so the email address exists
				console.log('results', results);
				return next(new Error("email must be unique"));
      } else {
          return next();
      }
    });
  } catch (err) {
		console.log('error', err);
    return next(err);
  }
});

users.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

users.plugin(autoIncrement.plugin, 'users');
module.exports = database.model('users', users, 'users');
