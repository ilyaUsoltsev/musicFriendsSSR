const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/vkontakte', passport.authenticate('vkontakte', {scope: ['profile', 'email']}));

router.get('/vkontakte/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


module.exports = router;