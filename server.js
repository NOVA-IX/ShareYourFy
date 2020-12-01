const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const auth = require('./routes/auth')
const services = require('./routes/Services/Edroute')
const session = require('express-session')
const cookieParser = require('cookie-parser')
var expressLayouts = require('express-ejs-layouts')
const MongoStore = require('connect-mongodb-session')(session)

const app = express()

app.set('layout', __dirname + '/views/layouts/root')
app.set("layout login", false);
app.set('view engine','ejs')

//middlewares
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.use(expressLayouts)

//database connect
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err) console.log(err)
    else console.log("Database Connected")
})

//user session
app.use(session({
    name: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ uri: process.env.DB_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 //two weeks
    }
}));

app.use((req, res, next) => {
    // if (req.cookies.user_sid && !req.session.user) res.clearCookie('user_sid');
    next();
});

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) next()
    else res.redirect('/login');
};

//route
app.use('/auth',auth) 
app.use('/services',services)

app.get("/",(req,res) => {
    res.render('index',{user: req.session.user,title: 'Home'})
})

app.get('/index',(req,res)=>{
    res.redirect('/')
})

app.get("/about", (req, res) => {
    res.render('about',{user: req.session.user,title: 'About'})
})

app.get("/services", sessionChecker,(req, res) => {
    res.render('services',{user: req.session.user,title: 'Services'})
})

app.get("/contact", (req, res) => {
    res.render('contact',{user: req.session.user,title: 'Contact'})
})

app.get("/login",(req,res)=>{
    if(req.session.user)
        res.redirect('/')
    else
        res.render('login', { layout: 'layouts/authLayout' });
})

app.get("/logout",(req,res)=>{
    if (req.session) {
    req.session.destroy(err => {
      if (err)
        res.status(400).send('Unable to log out')
      else 
        res.redirect('/')
    });
  } else
    res.end()
})

//server
const port = process.env.PORT || 5001
app.listen(port,()=> console.log(`Server listening on ${port}`))