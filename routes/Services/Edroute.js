const express = require('express')
const router = express.Router()
const ED = require('../../models/ED')

router.post("/ed",async (req,res)=>{
    const {title,contact,instruments} = req.body

    const newEd = new ED({
        title: title, //TODO: replace with user.email when session is done
        email: req.session.user.email,
        contact: contact,
        instruments: instruments
    })
    await newEd.save()
    res.redirect('/services/ed')
})

router.get("/ed",(req,res)=>{
    ED.find({},(err,data)=> {
        if(err) res.send(err) 
        else res.render('Edservice',{user: req.session.user,title: "EdServices",data: data})
    })
})

module.exports = router