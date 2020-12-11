const express = require('express')
const Post = require('../../models/Post')
const router = express.Router()

router.get('/',(req,res)=>{
    Post.find({},(err,data)=> {
        console.log(data)
        res.render('forum',{user: req.session.user,title: "Forum",data: data,comment: data.comment})
    })
})

router.post('/:id/comment',(req,res)=>{
    const id = req.params.id
    try{
        Post.findById(id, (err,article) => {
            if (err)  res.json({ err: err});
            var comment = {username: req.body.username, comment: req.body.comment};
            article.comments.unshift(comment);
            article.save(() => {
                res.redirect(`/services/forum/${req.params.id}`);
            });
        });
    }catch(err){
        res.json({
            err: err
        })
    }
})

router.get('/:id',async (req,res)=>{
    const post = await Post.findById(req.params.id)
    if (post == null) res.redirect('/')
    res.json({
        post: post
    })
})

router.get('/new',async (req,res)=>{
    //render the editor
})

router.post('/',async (req,res)=>{
    const post = new Post({
        title: req.body.title,
        username: req.session.user.username,
        email: req.session.user.email
    })

    try{
        const thePost = await post.save()
        res.redirect(`/services/forum`)
        res.end()
    }catch(err){
        res.json({
          err: err,
        });
    }
})

module.exports = router