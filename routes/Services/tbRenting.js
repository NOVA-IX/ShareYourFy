const express = require('express')
const router = express.Router()
var multer  = require('multer')
const Textbook = require('../../models/Textbook')
const {FirebaseUpload} = require('../../utils/uploadFile')

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: multer.memoryStorage(), fileFilter: fileFilter })

router.post("/rent",upload.array('upload',5),async (req,res)=>{
    const {title,description,contact,price} = req.body
    
    let urls = []
    req.files.forEach((file) => {
        FirebaseUpload(file,'rent').then(async (url) =>{
            urls.push(url)
            if(urls.length == req.files.length){
                const newTextbook = new Textbook({
                    title: title, 
                    description: description,
                    email: req.session.user.email,
                    contact: contact,
                    imageUrl: urls,
                    price: price
                })
                await newTextbook.save()
                res.redirect('/services/rent')
            }
        }).catch((err)=>{
            res.status(200).json({
                "err": err
            })
            res.end();
        });
    })
})

router.get("/rent",(req,res)=>{
    Textbook.find({},(err,data)=> {
        if(err) res.send(err) 
        else res.render('Trservice',{user: req.session.user,title: "TRServices",data: data})
    })
})

module.exports = router