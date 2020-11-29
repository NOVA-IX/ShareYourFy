// api
const express = require('express')
const { validate, User } = require('../models/User')
const bcrypt = require('bcrypt')
const router = express.Router()

router.post('/register',async (req,res)=>{
    // const { error } = validate(req.body)
    console.log(req.body)

    // if (error) return res.status(400).send(error.details[0].message);

    //find an existing user
    var user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })

    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    res.redirect('/login')
})

router.post('/login',async (req,res)=>{
    // const { error } = validate(req.body)

    const {name,email,password} = req.body

    // if (error) return res.status(400).send(error.details[0].message);

    var user = await User.findOne({ email: email });

    if(bcrypt.compare(password,user.password)){
        req.session.user = user
        res.redirect('/services')
    }else{
        res.redirect('/login')
    }
})

module.exports = router