const debug = require('debug')('syf:profile')
const express = require('express')
const { findMessages } = require('../utils/saveMessage')

const router = express.Router()

router.get('/', (req, res) => {
	const messages = findMessages(req.session.user.id)
	debug(messages)
	res.render('profile', {
		user: req.session.user,
		title: 'Profile',
		messages,
	})
})

module.exports = router
