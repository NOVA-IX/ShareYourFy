const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const auth = require('./routes/auth')
const services = require('./routes/Services')
const main = require('./routes/main')
const session = require('express-session')
const cookieParser = require('cookie-parser')
var expressLayouts = require('express-ejs-layouts')
const MongoStore = require('connect-mongodb-session')(session)
const debug = require('debug')('sfy:server')

global._basedir = __dirname

const app = express()

app.set('layout', __dirname + '/views/layouts/root')
app.set('layout login', false)
app.set('view engine', 'ejs')

//middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(expressLayouts)

//database connect
mongoose.connect(
	process.env.DB_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	(err) => {
		if (err) debug(err)
		else debug('Database Connected')
	}
)

//user session
app.use(
	session({
		name: 'user_sid',
		secret: 'somerandonstuffs',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ uri: process.env.DB_URI }),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7 * 2, //two weeks
		},
	})
)

app.use((req, res, next) => {
	// if (req.cookies.user_sid && !req.session.user) res.clearCookie('user_sid');
	next()
})

//route
app.use('/auth', auth)
app.use('/services', services)
app.use('/', main)

//server
const port = process.env.PORT || 5001
app.listen(port, () => debug(`Server listening on ${port}`))
