/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('perfilesCtrl', perfilesCtrl)

function perfilesCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
 $scope.modal = null;
 $scope.referencias = [];
 $scope.uploading = false;
 $scope.payments = [];
 $scope.discountTable = [];

 $scope.form = {};
 $scope.form.data = {};

 menu.showMenu();

 $scope.new_record = function(){
     var modal = $modal.open({
        backdrop: 'static',
        templateUrl: 'views/perfiles/new_record.html',
        controller : 'perfilesCtrl'
     });
 }

 $scope.changedMaster = function(master){
    $scope.selectedMaster = $rootScope.perfiles.filter(function(p){
        return p.id == master
    })[0];
 }

 $scope.load = function(){

     if($stateParams.id){
         $scope.recordId = $stateParams.id;

         api.terceros($stateParams.id).get().then(function(response){
             $scope.recordDetail = response.data;
             $rootScope.loading = false;
         }).catch(function(e){
             $rootScope.loading = false;
         });
     }

     api.perfil().get().then(function(response){
         $rootScope.perfiles = response.data;
         $rootScope.perfilOptions = response.data.filter(function(p){
            return p.main;
         });
         $rootScope.loading = false;
     }).catch(function(e){
         $rootScope.loading = false;
     });
 }

 $scope.openTo = function($event) {
     $event.preventDefault();
     $event.stopPropagation();

     $scope.to = true;
 };

 $scope.openFrom = function($event) {
     $event.preventDefault();
     $event.stopPropagation();

     $scope.from = true;
 };

 $scope.dateOptions = {
     formatYear: 'yy',
     startingDay: 1
 };

 $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
 $scope.format = $scope.formats[0];

 $scope.edit_record = function(){
     $rootScope.formEdit = angular.copy(this.record);
     $rootScope.formEdit.estado = $rootScope.formEdit.estado ?  ($rootScope.formEdit.estado = 'Activo') : ($rootScope.formEdit.estado = 'Inactivo');
     
     $rootScope.modal = $modal.open({
         backdrop: 'static',
         templateUrl: 'views/perfiles/edit_record.html',
         controller : 'perfilesCtrl'
     });
 }

 $scope.update = function(){
     if($scope.formEditRecord.$valid){
         $rootScope.loading = true;

         $rootScope.formEdit.estado = ($rootScope.formEdit.estado == 'Activo') ? true   : false
         $rootScope.modal.close();

         api.perfil($rootScope.formEdit.id).put($rootScope.formEdit).then(function(response){
             $rootScope.loading  = false;
             $scope.load();
             $scope.homerTemplate = 'views/notification/notify.html';
             notify({ message: 'Registro actualizado con éxito', classes: 'alert-success', templateUrl: $scope.homerTemplate});
         }).catch(function(e){
             console.log(e.message);
         });
     }  
 }

 $scope.setSelected = function(){
     $scope.selectedRecord = this.record;
 }



 $scope.save = function(){
     if($scope.formRecord.$valid){
         $scope.$close();
         $rootScope.loading = true;

         $scope.form.data.estado  =  ($scope.form.data.estado == 'Activo' ? true : false);
         $scope.form.data.main = false;
         if($scope.selectedMaster){
            $scope.form.data.permisosdetalle = $scope.selectedMaster.permisosdetalle;
         }

         api.perfil().post($scope.form.data).then(function(response){
             $scope.load();
             $rootScope.loading = false;
             $scope.homerTemplate = 'views/notification/notify.html';
             delete $scope.form.data;
             notify({ message: 'Registro de perfil creado.', classes: 'alert-success', templateUrl: $scope.homerTemplate});
         }).catch(function(e){
             console.log(e.message);
         });
     }
 }

 $scope.detail = function(){
    $rootScope.$state.go('campaings.detail_periodo', { id: this.record.id});
 }

 $scope.remove  = function(id){
     api.perfil(id).delete().then(function(response){
         $scope.load();
         $rootScope.loading = false;
         sweetAlert.swal("Borrado!", "El perfil ha sido borrado correctamente", "success");
     }).catch(function(e){
         console.log(e.message);
     }); 
 }

 $scope.delete = function () {
     var id = this.record._id;

     sweetAlert.swal({
             title: "Estas seguro ?",
             text: "Quieres borrar de forma permanente este documento?",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "Si, Borrar!",
             cancelButtonText: "No, Cancelar!",
             closeOnConfirm: false,
             closeOnCancel: true },
         function (isConfirm) {
             if (isConfirm) {
                 $scope.remove(id)
             } 
         });
 }

}