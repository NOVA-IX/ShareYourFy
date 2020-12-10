const { text } = require('body-parser')
const express = require('express')
const router = express.Router()
const edroute = require('./Services/Edroute')
const textbook = require('./Services/tbRenting')
const forum = require('./Services/forum')

router.use('/',edroute)
router.use('/',textbook)
router.use('/forum',forum)

module.exports = router