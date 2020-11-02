const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine','ejs')

//middlewares
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + "/public"))

//database connect

//route
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

//server
const port = process.env.PORT || 5000
app.listen(port,()=> console.log(`Server listening on ${port}`))