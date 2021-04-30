const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
	res.render('profile', { user: req.session.user, title: 'Profile' })
})

router.post('/', (req, res) => {})

module.exports = router
