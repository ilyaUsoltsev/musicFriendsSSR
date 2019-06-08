const express = require('express');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const cities = require('../helpers/cities');

const {ensureAuthenticated} = require('../helpers/auth');

router.get('/filter/:type/:instrument/:city', (req, res) => {
    const type = req.params.type;
    const instrument = req.params.instrument;
    const city = req.params.city;
    let findObject = {};
    if (type === "all" && instrument === "all") {
        findObject = {city};
    } else if (type==="all") {
        findObject = {city,instrument};
    } else if (instrument === "all") {
        findObject = {city,type};
    } else {
        findObject = {city,type, instrument};
    }
    
    Post.find(findObject)
        .populate('user')
        .sort({date: 'desc'})
        .limit(50)
        .then(posts => 
            res.render('posts/index', {posts, type, instrument, city: city.toString(), cities})
        )
    
})
router.get('/', (req, res) => {
    Post.find({city: 1})
        .populate('user')
        .sort({date: 'desc'})
        .limit(50)
        .then(posts => 
            res.render('posts/index', {posts, cities})
        )
})


//show single story
router.get('/show/:id', (req,res) => {
    Post.findOne({
        _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(post => {
        res.render('posts/show', {post})
    })
});

//edit post
router.get('/edit/:id',(req,res) => {
    Post.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(post => {
        if(post.user.id != req.user.id) {
            res.redirect('/posts');
        } else {
            res.render('posts/edit', {post})
        }
    })
});

// add post
router.get('/add', ensureAuthenticated,(req, res) => {
    res.render('posts/add', {cities})
})

//process add post
router.post('/', (req,res) => {
    newPost = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        instrument: req.body.instrument,
        user: req.user.id,
        city: parseInt(req.body.city)
    }
    new Post(newPost)
        .save()
        .then(post => {
            res.redirect(`/posts/show/${post.id}`);
        })
});

//edit
router.put('/:id', (req, res) => {
    Post.findOne({
        _id: req.params.id
    })
    .then(post => {
        post.title = req.body.title;
        post.description = req.body.description;
        post.type = req.body.type;
        post.instrument = req.body.instrument;
        post.save()
            .then(post => {
                res.redirect('/profile');
            })
    })
});

//delete post
router.delete('/:id', (req,res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/profile');
        })
});

//add comment
router.post('/comments/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
        .then(post => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        };
        post.date = Date.now();
        post.comments.push(newComment);
        post.save()
            .then((post) => {
                res.redirect(`/posts/show/${post.id}`);
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;