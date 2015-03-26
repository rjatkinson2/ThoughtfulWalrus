var express = require('express');
var passport = require('passport');
var Q = require('q');
var google = require('passport-google-oauth').OAuth2Strategy;
var googleClient = require('./google-client-id');
var User = require('../db/models/user.js');
var UseCont = require('../users/userController.js');

passport.serializeUser(function(user, done){
  console.log('serialize user ----------');
  console.log(user.googleID);
  done(null, user.googleID);
});

passport.deserializeUser(function(id, done){
  // find passport's user value in the database
  // passport's user value is set by the value passed into done in serializeUser. 
  console.log('deserializeUser her -----------------------');
  User.findOne({googleID: id}, function(err, user) {
    console.log(err);
    done(err, user);
  });
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
  function(accessToken, refreshToken, profile, done) {
    console.log('profile.id-----------------------------------');
    console.log(profile.id);
    User.findOne({ googleID: profile.id }, function (err, user) {
      if(err){
        console.log('got an error');
        return done(err);
      }else if(user){
        console.log('got the user');
        console.log(user);
        return done(err, user);
      }else{
        console.log('got neither an error or the user');
        var newUser = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          googleName: profile.displayName,
          googleID: profile.id,
          emergencyContacts: []
        };
        User.create(newUser, function(err, user){
          console.log('user created');
          return done(err, user);
        });
      }
      return done(err, profile);
    });
  }
));

module.exports = passport;