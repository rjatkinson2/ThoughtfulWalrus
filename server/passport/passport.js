var express = require('express');
var passport = require('passport');
var google = require('passport-google-oauth').OAuth2Strategy();
var googleClientId = require('./google-client-id');

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

passport.use(new google({
  // Stored in google-client-id.js which must be .gitignored!
  clientId: google.GOOGLE_CLIENT_ID,
  clientSecret: google.GOOGLE_CLIENT_SECRET,
  callbackURL: google.GOOGLE_CLIENT_CALLBACK
}, 
  // Passport's verify callback function is meant to find a user that possess a set of credentials.
  // If the credentials are valid, the verify callback invokes done to supply Passport the user.
  function(accessToken, refreshToken, profile, done){
    process.nextTick(function(){
      done(null, user);
    });
}));