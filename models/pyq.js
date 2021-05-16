const mongoose = require('mongoose')

const PyqSchema = new mongoose.Schema({
	sem: {
		type: String,
		required: true,
	},
	uploaderEmail: {
		type: String,
		required: true,
	},
	subject: {
		type: String,
		required: true,
	},
	branch: {
		type: String,
		required: true,
	},
	paperUrl: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('pyq', PyqSchema)
