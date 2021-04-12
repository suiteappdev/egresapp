/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('categoriasCtrl', categoriasCtrl)

function categoriasCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
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
         templateUrl: 'views/categorias/new_record.html',
         controller : 'categoriasCtrl'
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
     api.categoria_padre().get().then(function(response){
         $rootScope.categorias = response.data;
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
     $rootScope.formEdit.estado = $rootScope.formEdit.estado ?  ($rootScope.formEdit.estado = 'Habilitado') : ($rootScope.formEdit.estado = 'Inhabilitado');
     $rootScope.modal = $modal.open({
         templateUrl: 'views/categorias/edit_record.html',
         controller : 'categoriasCtrl'
     });
 }

 $scope.update = function(){
     if($scope.formRecordEdit.$valid){
         $rootScope.loading = true;
         $rootScope.formEdit.estado = $rootScope.formEdit.estado == "Habilitado" ? true : false;
         api.categoria_padre($rootScope.formEdit.id).put($rootScope.formEdit).then(function(response){
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
         $scope.$close();
         $rootScope.loading = true;

         $scope.form.data.estado  =  ($scope.form.data.estado == 'Habilitado' ? true : false);

         api.categoria_padre().post($scope.form.data).then(function(response){
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
     api.categoria_padre(id).delete().then(function(response){
         $scope.load();
         $rootScope.loading = false;
         sweetAlert.swal("Borrado!", "EL ingreso ha sido borrado correctamente", "success");
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