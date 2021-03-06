"use strict";

/**
 * @ngdoc directive
 * @name labelsApp.directive:lsConfirmButton
 * @description
 * # confirmButton
 */
angular.module("labelsApp")
    .directive("lsConfirmButton", function() {
        return {
            templateUrl: "scripts/components/shared/confirm-button/confirm-button.html",
            restrict: "E",
            scope: {
                onConfirm: "&",  // passes on-confirm attribute to this scope
                text: "@",  // optional delete text
                confirmText: "@",  // optional text on confirm
                icon: "@",  // optional icon class
                inactive: "=",   // if true gets disabled
                size: "@"
            },
            link: function postLink(scope) {
                scope.showConfirm = false;
                scope.text = scope.text || "Delete";
                scope.confirmText = scope.confirmText || "Confirm";
                scope.icon = scope.icon || "icon-trash";
            }
        };
    });
