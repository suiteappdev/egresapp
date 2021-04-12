/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('usuariosCtrl', usuariosCtrl)

function usuariosCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
 $scope.modal = null;
 $scope.referencias = [];
 $scope.uploading = false;
 $scope.payments = [];
 $scope.discountTable = [];

 $scope.form = {};
 $scope.form.data = {};

 menu.showMenu();

 $scope.uploadFiles = function(){
     $('#files').click();
 }

 $scope.new_record = function(){
     var modal = $modal.open({
         backdrop : "static",
         templateUrl: 'views/usuarios/new_record.html',
         controller : 'usuariosCtrl'
     });
 }

 $scope.$watch('form.data.categoriadto', function(n, o){
    if(n){
        $scope.selectedCategoria = $scope.categorias.filter(function(c){ return c._id == n})[0];
    }
 });

 $scope.$watch('form.data.estadodocumento', function(n, o){
     if(n){
         $scope.selectedEstado = $scope.estados.filter(function(c){ return c._id == n})[0];
     }
  });

  $scope.$watch('form.data.fpago', function(n, o){
     if(n){
         $scope.selectedFormapago = $scope.formasPagos.filter(function(c){ return c._id == n})[0];
     }
  });

 $scope.load = function(){
     api.users().get().then(function(response){
         $rootScope.usuarios = response.data;
         $rootScope.loading = false;
     }).catch(function(e){
         $rootScope.loading = false;
     });

     api.perfil().get().then(function(response){
        $rootScope.perfils = response.data;
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
         templateUrl: 'views/usuarios/edit_record.html',
         controller : 'usuariosCtrl'
     });
 }

 $scope.update = function(){
     if($scope.formRecord.$valid){
         $rootScope.loading = true;
         $rootScope.formEdit.perfil = $scope.selectedProfile ? $scope.selectedProfile : null;
         $rootScope.formEdit.estado  =  ($rootScope.formEdit.estado == 'Activo' ? true : false);
        if($rootScope.formEdit.empresas){
            delete $rootScope.formEdit.empresas;
        }

        if($rootScope.formEdit.documentoegreso){
            delete $rootScope.formEdit.documentoegreso;
        }

        if($rootScope.formEdit.role){
            delete $rootScope.formEdit.role;
        }

         api.users($rootScope.formEdit.id).put($rootScope.formEdit).then(function(response){
             $rootScope.loading  = false;
             $scope.load();
             $scope.homerTemplate = 'views/notification/notify.html';
             notify({ message: 'Registro actualizado con éxito', classes: 'alert-success', templateUrl: $scope.homerTemplate});
            $scope.$close();
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

        if($scope.form.data.password != $scope.form.data.cpassword){
            return  sweetAlert.swal("Contraseña incorrecta", "Las contraseñas no coinciden", "error");
        }

         $scope.$close();
         $rootScope.loading = true;

         $scope.form.data.estado  =  ($scope.form.data.estado == 'Activo' ? true : false);
         $scope.form.data.username = $scope.form.data.email;
         api.users().post($scope.form.data).then(function(response){
             $scope.load();
             $rootScope.loading = false;
             $scope.homerTemplate = 'views/notification/notify.html';
             delete $scope.form.data;
             notify({ message: 'Registro de periodo creado.', classes: 'alert-success', templateUrl: $scope.homerTemplate});
         }).catch(function(e){
             console.log(e.message);
         });
     }
 }


 $scope.detail = function(){
    $rootScope.$state.go('campaings.detail_periodo', { id: this.record.id});
 }

 $scope.remove  = function(id){
     api.users(id).delete().then(function(response){
         $scope.load();
         $rootScope.loading = false;
         sweetAlert.swal("Borrado!", "El usuario ha sido borrado correctamente", "success");
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