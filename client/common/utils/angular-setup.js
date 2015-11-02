var angular = require('angular');
var router = require('angular-ui-router');
var debug = require('debug')('angular-setup');
var Promise = require('bluebird');


module.exports = function(){
  return new AngularSetup();
}


/*
 * Creates and configures an angular app, with the
 * idea of reducing repeated boilerplate.
 *
 */

 function AngularSetup(){

 };


/*
 * Sets up an angular module for an app with
 * a given module `name` and `deps` as an array.
 *
 * This sets up some default dependencies for the
 * module, configures the $locationProvider for
 * html5mode, and some runtime settings.
 *
 * Returns the angular module.
 *
 * @param {String} name
 * @param {Array} deps
 * @return {Angular Module}
 * @public
 */

AngularSetup.prototype.module = function(name, deps){
  if (this.mod) return;
  var self = this;
  var main = [router];
  deps = deps || [];

  main = main.concat(deps);
  this.mod = angular.module(name, main);
  this.name = name;

  debug('%s : setting up', this.name);

  this.mod.config(function($locationProvider, $compileProvider){
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })
    $compileProvider.debugInfoEnabled(false);
  })

  this.mod.run(function($rootScope, $state){
    self.onStateChange($state.current, $rootScope);

    // setup bluebird promise with angular.
    // http://stackoverflow.com/questions/23984471/how-do-i-use-bluebird-with-angular
    Promise.setScheduler(function (cb) {
      $rootScope.$evalAsync(cb);
    });

    $rootScope.$on('$stateChangeStart', function(e, toState){
      self.onStateChange(toState, $rootScope);
    });
  })

  return this.mod;
}


/*
 * Configuration for state change stuff
 *
 * @param {Object} toState
 * @param {$rootScope} $rootScope
 * @private
 */

AngularSetup.prototype.onStateChange = function(toState, $rootScope){
  debug('%s : state change', this.name);

  if (toState.data && toState.data.title) {
    document.title = toState.data.title;
  }
  $rootScope.stateName = (toState.name || '').replace(/\./g, '-');
}



/*
 * Sets up an angular state with given `name`
 * and state `opts`.
 *
 * @param {String} name
 * @param {Object} opts
 * @return {AngularSetup} this
 * @public
 */

AngularSetup.prototype.state = function(name, opts){
  if (!this.mod) throw new Error('must setup root angular module first');
  debug('%s : state setup "%s"', this.name, name);

  this.mod.config(function($stateProvider){
    $stateProvider.state(name, opts);
  })

  return this;
}
