var angular = require('angular');
var Masonry = require('masonry-layout');
var _ = require('underscore');


module.exports = angular
  .module('directives.masonry',[])
  .directive('masonry', function($timeout){

    function link(scope, element, attrs){
      element.addClass('masonry');
      element.css('visibility', 'hidden');

      var options = {
        gutter: 10,
        isFitWidth: true,
        isInitLayout: false
      };

      var msnry = new Masonry(element[0], angular.extend(options, scope.options));

      scope.reload = _.debounce(function(){
        msnry.reloadItems();
        msnry.layout();
      }, 100);

      scope.$on('masonryReload', scope.reload);

      msnry.once('layoutComplete', function(){
        element.css('visibility', '');
        element.addClass('masonry-complete');
      });

      $timeout(function () {
        msnry.reloadItems();
        msnry.layout();
      });
    }

    return {
      scope: {
        options: '=masonry'
      },
      transclude: true,
      replace:true,
      template: '<div class="masonry-grid" ng-transclude></div>',
      link: link
    }
  })
