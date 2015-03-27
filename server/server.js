var express = require('express');
var passport = require('./passport/passport.js');
var db = require('./db/config.js');
var app = express();
var mongoose = require('mongoose');
var User = require('./db/models/user.js');
var userController = require('./users/userController.js');
var jwt = require('jwt-simple');
var Q = require('q');
var authToken = process.env.DISTRESS_AUTH_TOKEN || require('./config/creds').distressAuthToken;

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
  function(req, res) {
    console.log(req.session);
    var findUser = Q.nbind(User.findOne, User);

    console.log(req.session.passport.user);

    User.findOne({ googleID: '115316789593956752014' }, function(err, user){
      console.log('userFoundHere');
      console.log(user);
      var token = jwt.encode(user, authToken);
      console.log(token);
      res.json({token: token});
      console.log('Successful login');
    });

    // findUser({ googleID: req.session.passport.user })
    //   .then(function(user, err) {
    //     console.log('thenHere');
    //     console.log(user);
    //     console.log(err);
    //     if (!user || err) {
    //       res.status(401).send('Bad request: User not found');
    //     } else {
    //       var token = jwt.encode(user, authToken);
    //       res.json({token: token});
    //       console.log('Successful login');
    //     }
    // }).fail(function(error){
    //   console.log('major failure');
    //   return next(new Error('No user'));
    // });

    // Successful authentication, redirect home.
    // res.redirect('/');
  });

app.get('/tokenizer', function(req, res){
  console.log('req.session2');
  console.log(req.session);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/signin');
});

console.log('ThoughtfulWalrus is listening on ' + port);
app.listen(port);

