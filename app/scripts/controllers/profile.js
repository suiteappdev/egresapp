/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('profileCtrl', profileCtrl)

function profileCtrl($scope, $rootScope, api, menu, $modal, $stateParams, $timeout) {
    $scope.filter = {};

    $rootScope.$on("reload_saldos", function(){

    });

    $scope.getDocuments = function(id){
        api.ingresos().add("periodo/" + (id ? id : "")).get().then(function(response){
            
            if(response  && response.data.length > 0){
                $scope.ingresos = response.data;
            }

            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });  
     }

    $scope.getEgresos = function(){
        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            console.log("selectedPeriodo", $scope.selectedPeriodo);

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            $scope.getByPeriodo($scope.filter.periodo);

        }).catch(function(e){
            $rootScope.loading = false;
        });
    }

    $scope.getIngresos = function(){
        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            $scope.getDocuments($scope.filter.periodo);
            
        }).catch(function(e){
            $rootScope.loading = false;
        });
    }

    $scope.totalize = function(){
        var total = 0;

        if(this.record.movimiento){

            this.record.movimiento.map(function(r){
                total = (total  + r.valor || 0)
            });
            
            return total;

        }

        return 0;
    }

    $scope.normalize = function(record){
        try {
            if(typeof(record.referencia) === typeof([])){
                
                record.txtReferencia =  record.referencia.map(function(r){
                    return r.name
                }).join("");

                return record.referencia.map(function(r){
                    return r.name
                }).join(',');   
            }   
        } catch (error) {
            return 'Sin referencias'
        }
    }

    $scope.getByPeriodo = function(id){
        $scope.getEgresos(id);
    }

    $scope.getEgresos = function(id){
        $scope.loading = true;

        api.egresos().add("/periodo/" + (id ? id : "")).get().then(function(response){
            if(response  && response.data.length > 0){
                $scope.egresos = response.data;
            }
            
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });  
     }
}