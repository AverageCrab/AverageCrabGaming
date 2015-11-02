var angular = require('angular');
var AngularSetup = require('../common/utils/angular-setup');
var ModalDirective = require('../common/directives/modal');
var MasonryDirective = require('../common/directives/masonry');

var setup = AngularSetup();
var app = module.exports = setup.module('public', [
  'directives.modal',
  'directives.masonry',
]);

window.jQuery = require('jquery');

require('bootstrap');

setup.state('public', {
  url: '/',
  template: require('./application/index.jade'),
  controller: require('./application/index'),
  controllerAs : 'vm',
});
// 
// setup.state('public.application', {
//   url: '/application',
//   template: require('./application/index.jade'),
//   controller: require('./application/index'),
//   controllerAs : 'vm',
// })
// 
// setup.state('public.funderRegistration', {
//   url: '/funderRegistration',
//   template: require('./funderRegistration/index.jade'),
//   controller: require('./funderRegistration/index'),
//   controllerAs : 'vm',
// })

