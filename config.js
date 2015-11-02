var env = process.env.NODE_ENV || 'local';
var yaml = require('js-yaml');
var fs = require('fs');

// Get document, or throw exception on error
var doc = yaml.safeLoad(fs.readFileSync(__dirname + '/config.yml', 'utf8'));

var obj = {};

for (var aKey in doc.default) {
  obj[aKey] = doc.default[aKey];
}

for (var key in doc[env]) {
  obj[key] = doc[env][key];
}

module.exports = obj;
