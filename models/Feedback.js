const string = require('joi/lib/types/string')
const mongoose = require('mongoose')
// const Joi = require('joi')

const FeedbackSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	feedback: {
		type: String,
		required: true,
	},
	uploadedAt: {
		type: Date,
		default: Date.now(),
	},
})

module.exports = mongoose.model('feedback', FeedbackSchema)
