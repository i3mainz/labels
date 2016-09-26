'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsLogin', {
    bindings: {
    },
    templateUrl: "scripts/components/login/login.html",

    controller: function ($scope, $location, $document, AuthService) {
        //skip login if authenticated
        // if (AuthService.isLoggedIn()) {
        //     $location.path("admin/vocabularies");
        // }

        //AuthService.status();

        //$scope.user = AuthService.getUser();

        $scope.onLoginClick = function() {
            $scope.error = false;
            $scope.disabled = true;  // block another click

            AuthService.login($scope.username, $scope.password).then(function() {
                //console.log("login worked! :)");
                $location.path('/admin/vocabularies');
            })
            .catch(function() {
                $scope.error = true;
                $scope.errorMessage = "some error message";  // res.userMessage
                $scope.disabled = false;
                $scope.username = "";
                $scope.password = "";
            });
        };

        // hotkeys
        $document.keydown(function(e) {
            if (e.keyCode === 13) {  // enter
                if ($scope.username && $scope.password) {
                    $scope.onLoginClick();
                }
            }
        });

    }
});
