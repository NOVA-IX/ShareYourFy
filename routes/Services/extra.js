const express = require("express");
const { route } = require("./forum");
const Blog = require('../../models/Blog')
const router = express.Router();

router.get('/',(req,res)=>{
    Blog.find({},(err,data)=> {
      if(err) res.json(err)
      res.render('extmat',{user: req.session.user,title: "extra",data: data})
    })  
})

router.post('/',async (req,res)=>{
    const blog = new Blog({
        title: req.body.title,
        username: req.session.user.username,
        markdown: req.body.markdown,
        email: req.session.user.email,
        topic: req.body.topic
    })

    try{
        await blog.save()
        res.redirect('/services/extra')
    }catch(err){
        res.json({
          err: err,
        });
    }
})  

router.post("/blog/:id", async (req, res) => {
    try{
        const post = await Blog.findById(req.params.id)
        if (post == null) res.redirect('/')
        res.json(post)
    }catch(err){
        res.json({
            err: err
        })
    }
});

router.post("/blog/:id/comment", (req, res) => {
    const id = req.params.id;
    try {
      Blog.findById(id, (err, article) => {
        if (err) res.json({ err: err });
        var comment = {
          username: req.session.user.username,
          comment: req.body.comment,
        };
        article.comments.unshift(comment);
        article.save(() => {
          res.redirect(`/services/extra/blog/${req.params.id}`);
        });
      });
    } catch (err) {
      res.json({
        err: err,
      });
    }
});

module.exports = router