const Joi = require('joi')
const express = require('express')
const multer = require('multer')
const debug = require('debug')('sfy:pyq')
const { FirebaseUpload } = require('../../utils/uploadFile')
const pyq = require('../../models/pyq')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', (req, res) => {
	pyq.find({}, (err, data) => {
		if (err) res.send(err)
		else
			res.render('pyq', {
				user: req.session.user,
				title: 'Previous Year Questions Paper',
				data: data,
			})
	})
})

router.post('/', upload.single('upload'), async (req, res) => {
	const data = {
		sem: req.body.sem,
		branch: req.body.branch,
		subject: req.body.subject,
	}

	const check = {
		sem: Joi.string().min(3).max(64).required(),
		branch: Joi.string().min(2).max(10).required(),
		subject: Joi.string().min(2).max(64).required(),
	}

	const { error } = Joi.validate(data, check)

	if (error) {
		debug(error)
		res.end()
	} else {
		FirebaseUpload(req.file, 'pyq')
			.then(async (url) => {
				debug(url)
				req.body.paperUrl = url
				req.body.uploaderEmail = req.session.user.email
				const pyqModel = new pyq(req.body)
				pyqModel.save((err, result) => {
					if (err) {
						debug('err: ')
						debug(err)
						res.end()
					} else if (result) {
						debug('Added Successfully')
						res.redirect('back')
					}
				})
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
module.exports = router
