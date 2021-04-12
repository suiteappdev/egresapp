/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('navigationCtrl', navigationCtrl)

function navigationCtrl($scope, $rootScope, api, menu, $modal, $stateParams, $timeout) {
    $scope.filter = {};

    $rootScope.$on("reload_saldos", function(){
        $scope.load();
    });

    $scope.getDocuments = function(id){
        api.ingresos().add("periodo/" + (id ? id : "")).get().then(function(response){
            $rootScope.ingresos = response.data;
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });  
     }

    $scope.load = function(){
        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            api.saldosIngresos().add('saldos/consolidado/').add("periodo/" + $scope.filter.periodo).get().then(function(response){
                $rootScope.saldoIngresos = response.data;
            }).catch(function(e){
                $scope.loading = false;
            });

        }).catch(function(e){
            $rootScope.loading = false;
        });
    }
}