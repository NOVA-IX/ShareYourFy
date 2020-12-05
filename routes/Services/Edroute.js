const express = require('express')
const router = express.Router()
var multer  = require('multer')
const path = require('path')
const ED = require('../../models/ED')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, _basedir + '/public/uploads/ed');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

router.post("/ed",upload.single('upload'),async (req,res)=>{
    const {title,contact,instruments} = req.body

    const newEd = new ED({
        title: title, 
        email: req.session.user.email,
        contact: contact,
        imageUrl: '../uploads/ed/' + req.file.filename,
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