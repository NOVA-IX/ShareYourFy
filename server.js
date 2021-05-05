const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const auth = require('./routes/auth')
const services = require('./routes/Services')
const main = require('./routes/main')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const expressLayouts = require('express-ejs-layouts')
const MongoStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
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
app.use(flash())

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
	res.locals.error = req.flash('error')
	res.locals.success = req.flash('success')
	res.locals.req = req
	next()
})

//route
app.use('/auth', auth)
app.use('/services', services)
app.use('/', main)

//server
const port = process.env.PORT || 5001

const server = app.listen(port, () => debug(`Server listening on ${port}`))

const io = require('socket.io')(server)

var users = []

io.sockets.on('connection', function (socket) {
	socket.on('user_connected', (id) => {
		users[id] = socket.id
		console.log(id)
	})

	// socket.on('adduser', function (data) {
	// var username = data.username
	// var room = data.room
	// if (rooms.indexOf(room) != -1) {
	// 	socket.username = username
	// 	socket.room = room
	// 	usernames[username] = username
	// 	socket.join(room)
	// 	socket.emit(
	// 		'updatechat',
	// 		'SERVER',
	// 		'You are connected. Start chatting'
	// 	)
	// 	socket.broadcast
	// 		.to(room)
	// 		.emit(
	// 			'updatechat',
	// 			'SERVER',
	// 			username + ' has connected to this room'
	// 		)
	// } else {
	// 	socket.emit('updatechat', 'SERVER', 'Please enter valid code.')
	// }
	// })

	socket.on('createroom', function (data) {
		var new_room = ('' + Math.random()).substring(2, 7)
		rooms.push(new_room)
		data.room = new_room
		socket.emit(
			'updatechat',
			'SERVER',
			'Your room is ready, invite someone using this ID:' + new_room
		)
		socket.emit('roomcreated', data)
	})

	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, data)
	})

	//user sends the message
	// things to collect:-
	// the selected chat id
	// my id
	// message
	// things to do:
	// render the message

	// server side

	// socket.on('disconnect', function () {
	// 	delete usernames[socket.username]
	// 	io.sockets.emit('updateusers', usernames)
	// 	if (socket.username !== undefined) {
	// 		socket.broadcast.emit(
	// 			'updatechat',
	// 			'SERVER',
	// 			socket.username + ' has disconnected'
	// 		)
	// 		socket.leave(socket.room)
	// 	}
	// })
})
