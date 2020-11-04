// api
const express = require('express')
const { validate, User } = require('../models/User')
const bcrypt = require('bcrypt')
const router = express.Router()

router.post('/register',async (req,res)=>{
    const { error } = validate(req.body)

    if (error) return res.status(400).send(error.details[0].message);

    //find an existing user
    var user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    })

    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = user.generateAuthToken();

    res.header("x-auth-token", token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });
})

module.exports = router