'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:listBox
 * @description
 * # listBox
 */
angular.module('labelsApp')
  .directive('listBox', function () {
    return {
        templateUrl: "views/directive-list-box.html",
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            //element.text('this is the listBox directive');
        }
    };
  });
