/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('manageCtrl', manageCtrl)

function manageCtrl($scope, $rootScope, api, $modal, menu) {
    menu.showMenu();

    $scope.load = function(){

    }

    $scope.save = function(){

    }

}