/**
 *
 * alertsCtrl
 *
 */

angular
    .module('homer')
    .controller('signupCtrl', signupCtrl)

function signupCtrl($scope, $rootScope, api) {

    $scope.signup = function($event){
        $event.preventDefault();
        api.signup($scope.form.data).then(function(response){
            localStorage.setItem("session", JSON.stringify(response.data));
            $rootScope.user = response.user;
            $rootScope.$state.go('dashboard');

            var empresa = {
                nombreempresa : $scope.form.data.nombreempresa,
                direccion : $scope.form.data.direccion,
                telefono : $scope.form.data.telefono,
                nit : $scope.form.data.nit,
                users : [response.data.id]
            }

            api.empresa().post(empresa).then(function(response){

            }).catch((function(e){
                console.log("Error creando la empresa");
            }));

        }).catch(function(e){
            console.log("Error creando la empresa");
        });
    }
}