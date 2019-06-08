const express = require('express');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const mongoose = require('mongoose');
const Post = mongoose.model('posts');

router.get('/', (req, res) => {
    res.render('index/welcome');
});

router.get('/profile', ensureAuthenticated ,(req, res) => {
    Post.find({user: req.user.id})
    .then(posts => {
        res.render('index/profile', {posts})
    })
});

module.exports = router;