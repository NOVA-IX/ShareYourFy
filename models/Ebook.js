const mongoose = require('mongoose')

const ebookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	uploaderEmail: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	bookUrl: {
		type: String,
		required: true,
	},
	coverUrl: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('ebook', ebookSchema)
