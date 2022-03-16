'use strict';
const database = require('../database'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let teams = new Schema({
	name: {
		type: String,
		required: [true, 'name is required'],
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
});

module.exports = database.model('teams', teams, 'teams');
