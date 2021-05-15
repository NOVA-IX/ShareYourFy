const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
	res.render('pyq', {
		user: req.session.user,
		title: 'pyq',
	})
})

module.exports = router
