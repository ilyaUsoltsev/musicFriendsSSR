const VKontakteStrategy = require('passport-vkontakte').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
//load user model

const User = mongoose.model('users');

module.exports = function(passport) {
    passport.use(new VKontakteStrategy({
        clientID:     keys.clientID,
        clientSecret: keys.clientSecret,
        // callbackURL:  'https://powerful-crag-10911.herokuapp.com'
        callbackURL:  '/auth/vkontakte/callback',
        proxy: true,
        profileFields: ['city']
      },
      function(accessToken, refreshToken, params, profile, done) {

        const newUser = {
          vkontakteId: profile.id,
          email: params.email,
          photo: profile._json.photo,
          first_name: profile._json.first_name,
          last_name: profile._json.last_name,
          city: profile._json.city
        }
        //check for user
        User.findOne({
          vkontakteId: profile.id
        }).then(user => {
          if(user) {
            //return user
            done(null, user);
          } else {
            // create User
            new User(newUser)
              .save()
              .then(user => done(null, user));
          }
        })
      }
    ));

    passport.serializeUser((user, done) => {
      done(null, user.id)
    });
    passport.deserializeUser((id, done) => {
      User.findById(id).then(user => {
        done(null, user);
      });
    });
}