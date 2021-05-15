// api
const debug = require('debug')('auth:/')
const express = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const validator = require('validator')
const { User } = require('../models/User')

const router = express.Router()

router.post('/register', async (req, res) => {
	const data = {
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	}
	const check = {
		name: Joi.string().min(4).max(32).required().trim(),
		username: Joi.string().min(4).max(32).required().trim(),
		email: Joi.string().email().min(8).max(64).required().trim(),
		password: Joi.string().required().min(6).max(32).trim(),
	}
	const { error } = Joi.validate(data, check)
	req.flash(null)

	if (error) {
		req.flash('error', error.details[0].message)
		res.redirect('back')
	} else if (validator.contains(req.body.username, ' ')) {
		req.flash('error', '"username" should not contain blank space')
		res.redirect('back')
	} else if (
		!validator.contains(req.body.email, '@siesgst.ac.in') &&
		!validator.contains(req.body.email, '@gst.sies.edu.in') &&
		!validator.contains(req.body.email, '@sies.edu.in')
	) {
		req.flash(
			'error',
			'Registration is only for students of SIES GST. If you are from SIESGST, use your @siesgst.ac.in or @gst.sies.edu.in email'
		)
		res.redirect('back')
	} else {
		User.findOne({ email: req.body.email }, (err, result) => {
			if (result) {
				req.flash(
					'error',
					'User with that email address already exists'
				)
				res.redirect('back')
			} else if (!err) {
				User.findOne(
					{ username: req.body.username },
					(errUser, resultUser) => {
						if (resultUser) {
							req.flash(
								'error',
								'User with that username already exists'
							)
							res.redirect('back')
						} else if (!errUser) {
							bcrypt.hash(req.body.password, 10, (err, hash) => {
								if (err) {
									debug(err)
									req.flash('error', 'Some error. Try again')
									res.redirect('back')
								} else {
									req.body.password = hash
									const user = new User(req.body)
									user.save((err, result) => {
										if (err) {
											req.flash(
												'error',
												'Some error. Try again'
											)
											res.redirect('back')
										} else if (result) {
											req.flash(
												'success',
												'Registration successfull'
											)
											res.redirect('/login')
										} else {
											req.flash(
												'error',
												'Some error. Try again'
											)
											res.redirect('back')
										}
									})
								}
							})
						} else {
							req.flash('error', 'Some error. Try again')
							res.redirect('back')
						}
					}
				)
			} else {
				req.flash('error', 'Some error. Try again')
				res.redirect('back')
			}
		})
	}
})

router.post('/login', async (req, res) => {
	const data = {
		email: req.body.email,
		password: req.body.password,
	}

	const check = {
		email: Joi.string().email().required().trim(),
		password: Joi.string().required().min(6).max(32),
	}

	const { error } = Joi.validate(data, check)

	if (error) {
		req.flash('error', error.details[0].message)
		res.redirect('back')
	} else {
		User.findOne({ email: req.body.email }, (err, user) => {
			if (err || !user) {
				req.flash('error', 'Incorrect email address')
				res.redirect('back')
			} else if (!err) {
				bcrypt.compare(
					req.body.password,
					user.password,
					(err, match) => {
						if (err) {
							debug(err)
							req.flash('error', 'Some error. Try again')
							res.redirect('back')
						} else if (match) {
							req.session.user = user
							req.flash('success', `Welcome! ${user.username}`)
							res.redirect('/services')
						} else if (!match) {
							req.flash('error', 'Wrong Password')
							res.redirect('back')
						} else {
							req.flash('error', 'Something Went Wrong!')
							res.redirect('back')
						}
					}
				)
			} else {
				req.flash('error', 'Something Went Wrong!')
				res.redirect('back')
			}
		})
	}
})

module.exports = router
