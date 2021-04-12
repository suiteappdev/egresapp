/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('campaingCtrl', campaingCtrl)

function campaingCtrl($scope, $rootScope, api, menu, $modal, $stateParams, $timeout) {
    $scope.campaings = [];
    
    $scope.load = function(){
        api.campaings().get().then(function(response){
            $scope.campaings = response.data;
        }).catch(function(e){
            console.log(e.message);
        });     
    }
    
    $scope.new_campaing = function(){
        $scope.modal = $modal.open({
            templateUrl: 'views/campaings/new_campaing.html',
            controller: 'campaingCtrl',
        });
    }

    $scope.save = function(){
        if($scope.formCampaing.$valid){
            api.campaings().post($scope.form.data).then(function(response){
                $scope.campaing = response.data;
                $scope.campaings.data.push( response.data);
                $scope.$close();

            }).catch(function(e){
                console.log(e.message);
            });
        }
        console.log("form.data", $scope.form);
    }

}