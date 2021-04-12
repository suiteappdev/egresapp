/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('adminsCtrl', adminsCtrl)

function adminsCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
    $scope.users= [];
    $scope.role = $stateParams.role;
    $rootScope.campaing = $stateParams.campaing;
    $scope.modal = null;

    menu.showMenu();
    
    $scope.load = function(){
        $rootScope.loading = true;

        api.administrator().get().then(function(response){
            $scope.users = response.data.data;
            $rootScope.loading = false;
        }).catch(function(e){
            console.log(e.message);
            $rootScope.loading = false;
        });
    }
    
    $scope.new_admin = function(){
        var modal = $modal.open({
            templateUrl: 'views/admins/new_admin.html',
            controller : 'adminsCtrl'
        });
    }

    $scope.edit_admin = function(){
        $scope.formEdit = angular.copy(this.user);

        $scope.modal = $modal.open({
            templateUrl: 'views/admins/edit_admin.html',
            scope : $scope
        });
    }

    $scope.update = function(){
        if($scope.formEditUser.$valid){
            $rootScope.loading = true;
            $scope.modal.close();
            api.administrator($scope.formEdit.id).put($scope.formEdit).then(function(response){
                $scope.load();
                $rootScope.loading = false;
                $scope.homerTemplate = 'views/notification/notify.html';
                notify({ message: 'admin updated successfull', classes: 'alert-success', templateUrl: $scope.homerTemplate});
            }).catch(function(e){
                console.log(e.message);
            });
        }  
    }

    $scope.save = function(){
        if($scope.formUser.$valid){
            $scope.$close();
            $rootScope.loading = true;
            $scope.form.data.metadata = {};
            $scope.form.data.metadata.database = $rootScope.user.metadata.database;
            
            api.administrator().post($scope.form.data).then(function(response){
                $scope.load();
                $rootScope.loading = false;
                $scope.homerTemplate = 'views/notification/notify.html';
                notify({ message: 'admin created successfull', classes: 'alert-success', templateUrl: $scope.homerTemplate});
            }).catch(function(e){
                console.log(e.message);
            });
        }
    }

    $scope.remove  = function(){
        api.administrator($scope.selectedUser.id).delete().then(function(response){
            $scope.load();
            $rootScope.loading = false;
            sweetAlert.swal("Deleted!", "Your admin user has been deleted.", "success");
        }).catch(function(e){
            console.log(e.message);
        }); 
    }

    $scope.delete = function () {
        $scope.selectedUser = this.user;

        sweetAlert.swal({
                title: "Are you sure?",
                text: "Do you want delete this administrator?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.remove()
                } 
            });
    }

}