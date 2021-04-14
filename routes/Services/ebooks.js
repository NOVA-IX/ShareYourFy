const Joi = require('joi')
const express = require('express')
const multer = require('multer')
const debug = require('debug')('sfy:ebooks')
const { FirebaseUpload } = require('../../utils/uploadFile')
const Ebook = require('../../models/Ebook')

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('upload'), async (req, res) => {
	const data = {
		title: req.body.title,
		description: req.body.description,
	}

	const check = {
		title: Joi.string().min(3).max(64).required(),
		description: Joi.string().min(15).max(120).required(),
	}

	const { error } = Joi.validate(data, check)

	if (error) {
		debug(error)
		res.end()
	} else {
		FirebaseUpload(req.file, 'ebooks')
			.then(async (url) => {
				req.body.uploaderEmail = req.session.user.email
				req.body.bookUrl = url
				req.body.coverUrl = '#'
				const ebook = new Ebook(req.body)
				ebook.save((err, result) => {
					if (err) {
						debug(err)
						res.end()
					} else if (result) {
						debug('Added Successfully')
						res.redirect('/ebook/json')
					}
				})
			})
			.catch((err) => {
				res.status(200).json({
					err: err,
				})
				res.end()
			})
	}
})

router.get('/', (req, res) => {
	res.render('ebooks', { user: req.session.user, title: 'ebooks' })
})

router.get('/json', (req, res) => {
	Ebook.find({}, (err, data) => {
		if (err) res.send(err)
		else res.json(data)
	})
})

module.exports = router
