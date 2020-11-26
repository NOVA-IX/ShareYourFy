const express = require('express')
const router = express.Router()
const ED = require('../../models/ED')

router.post("/ed",async (req,res)=>{
    console.log(req.body)
    const {title,contact} = req.body

    const newEd = new ED({
        title: title, //TODO: replace with user.email when session is done
        phone: contact,
        description: "lol"
    })

    await newEd.save()
    res.redirect('/services')
})

router.get("/ed",(req,res)=>{
    ED.find({},(err,data)=> {
        if(err) res.send(err) 
        else res.render('Edservice',{user: req.session.user,data: data})
    })
})

module.exports = router