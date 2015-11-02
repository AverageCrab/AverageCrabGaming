var angular = require('angular');
var template = require('./template.jade');


module.exports = angular
  .module('directives.modal', [])
  .directive('modal', function($timeout){
    return {
      restrict: 'E',
      scope: {
        isOpen: '='
      },
      transclude: true,

      link: function(scope, element, attrs) {
        var el = element.detach();
        var body = angular.element(document.body);

        scope.dialogStyle = {};

        if (attrs.width) {
          scope.dialogStyle.width = attrs.width;
        }

        if (attrs.height) {
          scope.dialogStyle.height = attrs.height;
        }

        scope.hideModal = function() {
          scope.isOpen = false;
        };

        scope.$on('$destroy', function() {
          if (scope.appended == true) {
            scope.appended = false;
            el.detach();
            body.css('position', '');
          }
        });

        scope.$watch('isOpen', function(newValue, oldValue){
          if (newValue) {
            scope.appended = true;
            body.css('position', 'fixed');
            body.append(el);

          } else if (scope.appended == true) {
            scope.appended = false;
            el.addClass('ge-modal-out');

            setTimeout(function(){
              el.detach();
              body.css('position', '');
              el.removeClass('ge-modal-out');
            }, 400)
          }
        })

      },

      template: template
    };
  })
