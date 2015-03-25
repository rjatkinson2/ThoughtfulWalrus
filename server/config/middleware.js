var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    passport = require('passport'),
    session = require('express-session');

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var smsRouter = express.Router();
  var userRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // required by passport to utilize sessions
  app.use(session({ secret: 'let it go' }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(express.static(__dirname + '/../../client'));

  app.use('/sms', smsRouter); // use sms router for all sms requests
  app.use('/user', userRouter); // use user router for all user requests

  // pull in routing functions and supply router as argument
  require('../sms/smsRoutes.js')(smsRouter);
  require('../users/userRoutes.js')(userRouter);
};
