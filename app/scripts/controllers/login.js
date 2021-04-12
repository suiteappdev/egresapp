/**
 *
 * alertsCtrl
 *
 */

angular
    .module('homer')
    .controller('loginCtrl', loginCtrl)

function loginCtrl($scope, $rootScope, api, $timeout, sweetAlert) {

    $scope.login = function($event){
        $event.preventDefault();
        
        api.login($scope.form.data).then(function(response){
            localStorage.setItem("session", JSON.stringify(response.data));
            $rootScope.user = response.data.user;
            
            return $rootScope.$state.go('campaings', { campaing : $rootScope.user.campaing_id});
        }).catch(function(e){
                if(e.data.statusCode == 400){
                    return sweetAlert.swal("Login Error", "Usuario/contraseña incorrectos", "error"); 
                }
        });
    }

}