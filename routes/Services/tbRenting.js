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

router.post("/rent",upload.single('upload'),async (req,res)=>{
    const {title,contact} = req.body

    FirebaseUpload(req.file).then(async (url) =>{
        const newTextbook = new Textbook({
            title: title, 
            email: req.session.user.email,
            contact: contact,
            imageUrl: url
        })
        await newTextbook.save()
        res.redirect('/services/ed')
    }).catch((err)=>{
        res.status(200).json({
            "err": err
        })
        res.end();
    });
})

router.get("/rent",(req,res)=>{
    Textbook.find({},(err,data)=> {
        // if(err) res.send(err) 
        // else res.render('Edservice',{user: req.session.user,title: "EdServices",data: data})
        res.json(data)
    })
})

module.exports = router