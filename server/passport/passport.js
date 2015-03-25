var express = require('express');
var passport = require('passport');
var google = require('passport-google-oauth').OAuth2Strategy;
var googleClient = require('./google-client-id');
var User = require('../db/models/user');

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

passport.use(new google(
  {
    // Stored in google-client-id.js which must be .gitignored!
    clientID: googleClient.GOOGLE_CLIENT_ID,
    clientSecret: googleClient.GOOGLE_CLIENT_SECRET,
    callbackURL: googleClient.GOOGLE_CLIENT_CALLBACK
  },
  // Passport's verify callback function is meant to find a user that possess a set of credentials.
  // If the credentials are valid, the verify callback invokes done to supply Passport the user.
  function(accessToken, refreshToken, profile, done){
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log(User);
    User.findOrCreate({
      username: 'joey',
      password: 'meatballs',
      firstName: 'joey',
      lastName: 'meatballs'
    }, function (err, user) {
      return done(err, user);
    });
  }
));

module.exports = passport;