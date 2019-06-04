const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/vkontakte', passport.authenticate('vkontakte', {scope: ['profile', 'email']}));

router.get('/vkontakte/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
    console.log('logged!');
  });


module.exports = router;