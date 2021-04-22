const Joi = require('joi')
const express = require('express')
const multer = require('multer')
const debug = require('debug')('sfy:ebooks')
const { FirebaseUpload } = require('../../utils/uploadFile')
const Ebook = require('../../models/Ebook')
const ejs = require('ejs')
const { fetchCoverLink } = require('../../utils/fetchImage')

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('upload'), async (req, res) => {
	const data = {
		title: req.body.title,
		author: req.body.author,
		branch: req.body.branch,
	}

	const check = {
		title: Joi.string().min(3).max(64).required(),
		author: Joi.string().min(4).max(20).required(),
		branch: Joi.string().min(2).max(10).required(),
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
				fetchCoverLink(`${req.body.title} ${req.body.author}`)
					.then((url) => {
						req.body.coverUrl = url
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
					.catch((err) => {})
			})
			.catch((err) => {
				console.log(err)
				console.log('err')
				res.status(200).json({
					err: err,
				})
				res.end()
			})
	}
})

router.get('/', (req, res) => {
	const query = req.query.query
	debug(query)
	if (query) {
		Ebook.find(
			{
				$or: [
					{ author: { $regex: query } },
					{ title: { $regex: query } },
				],
			},
			(err, data) => {
				if (err) {
					debug(err)
					res.send('Something Went Wrong')
				} else if (data) {
					return res.render('ebooks', {
						user: req.session.user,
						title: 'ebooks',
						data,
					})
				}
			}
		)
	} else {
		Ebook.find({}, (err, data) => {
			if (err) {
				res.flash('error', 'Something went wrong!')
			} else {
				return res.render('ebooks', {
					user: req.session.user,
					title: 'ebooks',
					data,
				})
			}
		})
	}
})

router.get('/json', (req, res) => {
	Ebook.find({}, (err, data) => {
		if (err) res.send(err)
		else res.json(data)
	})
})

module.exports = router
