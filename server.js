const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const auth = require('./routes/auth')
const services = require('./routes/Services/Edroute')
const session = require('cookie-session')
const cookieParser = require('cookie-parser');

const app = express()

app.set('view engine','ejs')

//middlewares
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())

//user session
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
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

//database connect
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err) console.log(err)
    else console.log("Database Connected")
})

//route
app.use('/auth',auth) //login endpoint
app.use('/services',services) //services endpoint

app.get("/",(req,res) => {
    res.render('index',{user: req.session.user})
})

app.get('/index',(req,res)=>{
    res.redirect('/')
})

app.get("/about", (req, res) => {
    res.render('about',{user: req.session.user})
})

app.get("/services", sessionChecker,(req, res) => {
    res.render('services',{user: req.session.user})
})

app.get("/contact", (req, res) => {
    res.render('contact',{user: req.session.user})
})

app.get("/login",(req,res)=>{
    if(req.session.user)
        res.redirect('/')
    else
        res.render('login',{user: req.session.user})
})

//server
const port = process.env.PORT || 5001
app.listen(port,()=> console.log(`Server listening on ${port}`))