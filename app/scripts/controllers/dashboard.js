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
    $scope.modal = {};
    $scope.openTo = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.modal.to = !$scope.modal.to;
    };

    $scope.openFrom = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.modal.from = !$scope.modal.from;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.query = function(){
        api.saldosIngresos().add('saldos/consolidado/').add("periodo/" + $scope.selectedPeriodoInicial.id).add("/" + moment(new Date($scope.fechainicial)).format("YYYY-MM-DD")).add("/" + moment(new Date($scope.fechafinal)).format("YYYY-MM-DD")).get().then(function(response){
            $rootScope.saldoIngresos = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });

        api.saldosEgresos().add('saldos/consolidado/').add("periodo/" +  $scope.selectedPeriodoInicial.id).add("/" + moment(new Date($scope.fechainicial)).format("YYYY-MM-DD")).add("/" + moment(new Date($scope.fechafinal)).format("YYYY-MM-DD")).get().then(function(response){
            $rootScope.saldoEgresos = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });

        api.formasPagos().add('saldos-range').add("/" +moment(new Date($scope.fechainicial)).format("YYYY-MM-DD")).add("/" + moment(new Date($scope.fechafinal)).format("YYYY-MM-DD")).get().then(function(response){
            $scope.consolidado = response.data;
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });

    }

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
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

        api.periodo().get().then(function(response){
            $scope.periodos = response.data;

            $scope.selectedPeriodoInicial = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.selectedPeriodoFinal = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            api.formasPagos().add('saldos/').add($scope.selectedPeriodoInicial.id).add("/").add($scope.selectedPeriodoInicial.id).get().then(function(response){
                $scope.consolidado = response.data;
                $scope.loading = false;
            }).catch(function(e){
                $scope.loading = false;
            });

            $scope.filter.periodo = $scope.selectedPeriodoFinal.id;

            api.saldosIngresos().add('saldos/consolidado/').add("periodo/" + $scope.selectedPeriodoInicial.id).get().then(function(response){
                $rootScope.saldoIngresos = response.data;
            }).catch(function(e){
                $scope.loading = false;
            });

            api.saldosEgresos().add('saldos/consolidado/').add("periodo/" +  $scope.selectedPeriodoInicial.id).get().then(function(response){
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