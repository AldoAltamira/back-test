'use strict';
const database = require('../database'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let pages = new Schema({
	name: {
		type: String,
		required: [true, 'name is required'],
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
  team: {
    type: Schema.Types.ObjectId,
    ref: 'teams',
  }
});

module.exports = database.model('pages', pages, 'pages');
