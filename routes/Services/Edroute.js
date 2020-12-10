const express = require('express')
const router = express.Router()
var multer  = require('multer')
const ED = require('../../models/ED')
const {FirebaseUpload} = require('../../utils/uploadFile')

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: multer.memoryStorage(), fileFilter: fileFilter })

router.post("/ed",upload.single('upload'),async (req,res)=>{
    const {title,contact,instruments} = req.body

    FirebaseUpload(req.file,'EDimages').then(async (url) =>{
        const newEd = new ED({
            title: title, 
            email: req.session.user.email,
            contact: contact,
            imageUrl: url,
            instruments: instruments
        })
        await newEd.save()
        res.redirect('/services/ed')
    }).catch((err)=>{
        res.status(200).json({
            "err": err
        })
        res.end();
    });
})

router.get("/ed",(req,res)=>{
    ED.find({},(err,data)=> {
        if(err) res.send(err) 
        else res.render('Edservice',{user: req.session.user,title: "EdServices",data: data})
    })
})

module.exports = router