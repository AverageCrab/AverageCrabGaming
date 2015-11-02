// var dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var sessions = require("client-sessions");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var pkg = require('../package.json');
var config = require('../config');

// exports express app
var app = module.exports = express();

// setup jade as default view engine
app.set('view engine', 'jade');


// middleware - logger
app.use(morgan('dev'));

// middleware - cookie parser
app.use(cookieParser());

// middleware - json body parsing
app.use(bodyParser.json())

// middleware - querystring parsing
app.use(bodyParser.urlencoded({ extended: false }));

// middleware - static build directory
app.use('/build', express.static(__dirname + '/../build'));

// vendor asset
var vendor = config.vendor_packages.map(function(v){
  var version = require('../node_modules/' + v + '/package.json').version;
  var slug = v + '-' + version;
  return '/build/vendor/' + slug;
})

// preset assets middleware
app.use(function(req, res, next){
  res.locals.asset_path = '/build/';
  res.locals.vendor = vendor;
  res.locals.styles = [];
  res.locals.scripts = [];
  next();
})

// // sub applications
// app.use(require('./api'));


// sub applications
app.use(require('./public'));
// app.use(require('./dashboard'));
// app.use(require('./funderDashboard'));
// start server
console.log('listening on port 8080');
app.listen(8080)
