const mongoose = require('mongoose')
const Inbox = require('./Inbox')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	username: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
	},
	inbox: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'inbox',
		},
	],
	//give different access rights if admin or not
	isAdmin: Boolean,
})

const User = mongoose.model('User', UserSchema)

//function to validate user
function validateUser(user) {
	// const schema = Joi.object({
	//     name: Joi.string().min(3).max(50).required(),
	//     email: Joi.string().min(5).max(255).required().email(),
	//     password: Joi.string().min(3).max(255).required()
	// })
	// return schema.validate(user, schema)
}

exports.User = User
exports.validate = validateUser
