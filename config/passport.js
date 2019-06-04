const VKontakteStrategy = require('passport-vkontakte').Strategy;

const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = function(passport) {
    passport.use(new VKontakteStrategy({
        clientID:     keys.clientID,
        clientSecret: keys.clientSecret,
        callbackURL:  'https://powerful-crag-10911.herokuapp.com/auth/vkontakte/callback'
        // proxy: true
      },
      function(accessToken, refreshToken, params, profile, done) {
        // console.log(params.email); // getting the email
        User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
            console.log('find or create');
          return done(err, user);
        });
        console.log(accessToken);
        console.log('hey!');
        console.log(profile);
      }
    ));
}