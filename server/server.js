var express = require('express');
var passport = require('./passport/passport.js');
var db = require('./db/config.js');
var app = express();
var mongoose = require('mongoose');
var User = require('./db/models/user.js');
var userController = require('./users/userController.js');

var port = process.env.PORT || 5000;

// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express, passport);


app.get('/',
  function(req, res) {
    console.log('req.session------------------------');
    console.log(req.session);
    res.render('index');
    res.end();
});

app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.get('/oauth2callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res, next) {
    
  },
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/signin');
});

console.log('ThoughtfulWalrus is listening on ' + port);
app.listen(port);

