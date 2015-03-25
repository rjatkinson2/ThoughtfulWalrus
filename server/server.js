var express = require('express');
var passport = require('./passport/passport.js');
var db = require('./db/config.js');


// intantiate express application
var app = express();
var mongoose = require('mongoose');
// grab the user model
var User = require('./db/models/user.js');

var port = process.env.PORT || 5000;

// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);

app.get('/', function(req, res) {
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
  passport.authenticate('google', {failureRedirect: '/login'}),
  function(req, res){
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

console.log('ThoughtfulWalrus is listening on ' + port);
app.listen(port);

