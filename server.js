const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const auth = require('./routes/auth')
const ed = require('./routes/ED/Edroute')

const app = express()

app.set('view engine','ejs')

//middlewares
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + "/public"))

//database connect
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err) console.log(err)
    console.log("Database Connected")
})

//route
app.use('/auth',auth)
app.use('/services',ed)

app.get('/index',(req,res)=>{
    res.redirect('/')
})

app.get("/",(req,res) => {
    res.render('index')
})

app.get("/about", (req, res) => {
    res.render('about')
})

app.get("/services", (req, res) => {
    res.render('services')
})

app.get("/contact", (req, res) => {
    res.render('contact')
})

app.get("/login",(req,res)=>{
    res.render('login')
})

app.get("/register",(req,res)=>{
    res.render('register')
})

//server
const port = process.env.PORT || 5000
app.listen(port,()=> console.log(`Server listening on ${port}`))