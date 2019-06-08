const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/vkontakte', passport.authenticate('vkontakte', {scope: ['profile', 'email']}));

router.get('/vkontakte/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/fail' }),
  function(req, res) {
    backURL=req.header('Referer') || '/posts';
    // do your thang
    res.redirect(backURL);

  });

// router.get('/verify', (req, res) => {
//   console.log(req.user);
// });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;