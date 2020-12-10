const express = require('express')
const router = express.Router()

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) next()
    else res.redirect('/login');
};

router.get("/",(req,res) => {
    res.render('index',{user: req.session.user,title: 'Home'})
})

router.get('/index',(req,res)=>{
    res.redirect('/')
})

router.get("/about", (req, res) => {
    res.render('about',{user: req.session.user,title: 'About'})
})

router.get("/services", sessionChecker,(req, res) => {
    res.render('services',{user: req.session.user,title: 'Services'})
})

router.get("/contact", (req, res) => {
    res.render('contact',{user: req.session.user,title: 'Contact'})
})

router.get("/login",(req,res)=>{
    if(req.session.user)
        res.redirect('/')
    else
        res.render('login', { layout: 'layouts/authLayout' });
})

router.get("/logout",(req,res)=>{
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

module.exports = router