'use strict';

/**
 * @ngdoc directive
 * @name labelsApp.directive:smallBox
 * @description
 * # smallBox
 */
 angular.module('labelsApp')
  .component('lsTranslationButton', {
    // isolated scope binding
    bindings: {
        data: "=",  // prefLabels
        onConfirm: "&"
    },
    templateUrl: "scripts/components/label-details/enrichment-browser/translation-button/translation-button.html",

    // The controller that handles our component logic
    controller: function ($scope, ngDialog, ConfigService) {
        var ctrl = this;
        $scope.languages = ConfigService.languages;

        // watcher for data
        $scope.$watchCollection(function() {
            return ctrl.data;
        }, function(newVal) {
            ctrl.data = newVal;
            ctrl.getUsedLanguages();
        });

        // determine already used languages and block their usage
        this.getUsedLanguages = function() {
            angular.forEach(ctrl.data, function(prefLabel) {

                // get language object and add new property
                var langObj = _.find($scope.languages, {value: prefLabel.lang});

                // update in languages collection
                var index = _.indexOf($scope.languages, langObj);

                if (index) {
                    langObj.used = true;
                    $scope.languages.splice(index, 1, langObj);
                }
            });
        };

        $scope.openDialog = function() {
            ngDialog.open({
                template: 'scripts/components/label-details/enrichment-browser/translation-button/dialog.html',
                className: 'bigdialog',
                showClose: false,
                closeByDocument: false,
                disableAnimation: true,
                scope: $scope
            });
        };
    }
});
