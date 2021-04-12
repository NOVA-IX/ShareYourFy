const express = require("express");
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('ebooks',{user: req.session.user,title: "ebooks"}) 
})

module.exports = router