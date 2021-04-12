/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('dashboardCtrl', dashboardCtrl)

function dashboardCtrl($scope, $rootScope, api, menu, $modal, $stateParams, $timeout) {
    $scope.filter = {};

    $rootScope.$on("reload_saldos", function(){
        api.formasPagos().add('saldos').get().then(function(response){
            $scope.consolidado = response.data;
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });
    });
    
    $scope.load = function(){
       api.formasPagos().add('saldos').get().then(function(response){
            $scope.consolidado = response.data;
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });

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

            api.saldosEgresos().add('saldos/consolidado/').add("periodo/" + $scope.filter.periodo).get().then(function(response){
                $rootScope.saldoEgresos = response.data;
            }).catch(function(e){
                $scope.loading = false;
            });

        }).catch(function(e){
            $rootScope.loading = false;
        });

        
        $scope.toNegative = function(value){
            return Math.abs(value) * -1;
        }
    }
}