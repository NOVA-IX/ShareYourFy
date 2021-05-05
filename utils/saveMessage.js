const debug = require('debug')('sfy:saveMessage')
const { User } = require('../models/User')

module.exports.saveMessage = (data) => {
	User.findById(data.to, (err, result) => {
		result.inbox.unshift(data)
		result.save((err, res) => {
			if (err) debug(err)
			return
		})
	})
}

module.exports.findMessages = (data) => {
	User.find(
		{ inbox: { $elemMatch: { to: data, from: data } } },
		(err, result) => {
			debug(result)
			return result
		}
	)
}
