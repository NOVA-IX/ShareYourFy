const { text } = require('body-parser')
const express = require('express')
const router = express.Router()
const edroute = require('./Services/Edroute')
const textbook = require('./Services/tbRenting')
const forum = require('./Services/forum')

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) next();
  else res.redirect("/login");
};

router.use('/',sessionChecker,edroute)
router.use('/',sessionChecker,textbook)
router.use('/forum',sessionChecker,forum)

module.exports = router