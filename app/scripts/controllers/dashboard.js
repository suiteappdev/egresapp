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

    $scope.compare = function(consolidado){
        var fp  = this.fp;

        if(consolidado && consolidado.result_egresos){
            if( consolidado.result_egresos.filter(function(e){
                return  (fp.forma_pago == e.forma_pago);
            })[0]){
                var egreso = consolidado.result_egresos.filter(function(e){
                    return  (fp.forma_pago == e.forma_pago);
                })[0]
    
                if(egreso){
                    this.fp.compare = true;
                    this.fp.gtotal = (this.fp.total - egreso.total)
                    this.fp.egreso =  egreso.total
                }
            }

        }

    }
    
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