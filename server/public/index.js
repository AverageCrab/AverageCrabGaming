var express = require('express');
var app = module.exports = express();

app.use(function(req, res, next){
  var corpPath = res.locals.asset_path + 'bundles/public/index';
  res.locals.styles = [corpPath];
  res.locals.scripts = [corpPath];
  next();
})

app.get('/', function(req, res){
  res.render(__dirname + '/template.jade');
});

// app.get('/application', function(req,res){
//   res.render(__dirname + '/template.jade');
// });
// app.get('/funderRegistration', function(req,res){
//   res.render(__dirname + '/template.jade');
// });
// app.get('/login', function(req, res){
//   res.render(__dirname + '/login/login.jade');
// });