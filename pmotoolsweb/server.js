// server.js

// modules =================================================
var express        	= require('express');
var app            	= express();
var bodyParser     	= require('body-parser'); // pull information from HTML POST (express4)
var methodOverride 	= require('method-override'); // simulate DELETE and PUT (express4)
var mongoose       	= require('mongoose');
var morgan         	= require('morgan'); // log requests to the console (express4)
var LeanKitClient  	= require('leankit-client');

// configuration ===========================================

// config files
var db = require('./config/db');

//development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
  });

}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// log every request to the console
app.use(morgan('dev'));

//configure OAuth2.0

  // routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;