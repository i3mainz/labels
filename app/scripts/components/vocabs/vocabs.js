'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsVocabs', {
    bindings: {
    },
    templateUrl: "scripts/components/vocabs/vocabs.html",

    controller: function ($scope, $q, $location, $http, ngDialog, AuthService, VocabService, LabelService, ConfigService) {
        // dont use that, vulnerable
        $scope.user = AuthService.getUser();

        $scope.languages = ConfigService.languages;

        VocabService.query({ creator: $scope.user.username }, function(vocabularies) {
            $scope.vocabularies = vocabularies;
        });

        /**
         * Logout current user and redirect to login page if successfull.
         */
        $scope.onLogoutClick = function() {
            AuthService.logout(function() {
                $location.path('/admin/login');
            }, function(err) {
                console.log(err);
            });
        };

        $scope.openUserDialog = function() {
            ngDialog.open({
                template: 'views/dialogs/user-metadata.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };

    }
});
