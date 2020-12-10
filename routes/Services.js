const { text } = require('body-parser')
const express = require('express')
const router = express.Router()
const edroute = require('./Services/Edroute')
const textbook = require('./Services/tbRenting')

router.use('/',edroute)
router.use('/',textbook)

module.exports = router