const express = require('express')
const router = express.Router()
const edroute = require('./Services/Edroute')
const textbook = require('./Services/tbRenting')
const forum = require('./Services/forum')
const extra = require("./Services/extra")
const ebooks = require("./Services/ebooks")
const { checkUser } = require('../middlewares/authorization')

router.use('/ed',checkUser,edroute)
router.use('/textbook',checkUser,textbook)
router.use('/forum',checkUser,forum)
router.use("/extra", checkUser, extra)
router.use('/ebooks',ebooks)

module.exports = router