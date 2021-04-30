const mongoose = require('mongoose')

const inboxSchema = new mongoose.Schema({
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	message: [
		{
			type: String,
			time: Date.now(),
		},
	],
	tag: {
		type: String,
		required: true,
	},
})

module.exports = mongoose.model('inbox', inboxSchema)
