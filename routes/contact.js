const express = require('express')
const Feedback = require('../models/Feedback')
const router = express.Router()

router.post('/', (req, res) => {
	req.flash(null)
	const feedbook = new Feedback(req.body)
	feedbook.save((err, result) => {
		if (err) {
			req.flash('error', 'Something went Wrong, Try again!')
			res.redirect('back')
		} else if (result) {
			req.flash(
				'success',
				'Thank You For Your Valuable Feedback!\nWe will get back to soon!'
			)
			res.redirect('back')
		}
	})
})

router.get('/', (req, res) => {
	res.render('contact', { user: req.session.user, title: 'Contact' })
})

module.exports = router
