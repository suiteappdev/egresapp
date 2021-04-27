/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('periodosCtrl', periodosCtrl)

function periodosCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
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

    $scope.totalize = function(movimiento){
        var total = 0;

        if(movimiento){

            movimiento.map(function(r){
                total = (total  + r.valor || 0)
            });
            
            return total;

        }

        return 0;
    }

    $scope.totalizeDetail = function(){
        var total = 0;

        if(this.recordDetail.movimiento){

            this.recordDetail.movimiento.map(function(r){
                total = (total  + r.valor || 0)
            });
            
            return total;

        }

        return 0;
    }

    $scope.addDiscount = function(){
        var modal = $modal.open({
            templateUrl: 'views/egresos/addDiscount.html',
            controller : 'egresosCtrl',
            scope : $scope
        });
    }

    $scope.applyDiscount = function(){
        $scope.$parent.form.data.descuento = $scope.discountTable;
        $scope.totalizeDiscount();
        $scope.$close();
    }

    $scope.totalizeDiscount = function(){
        $scope.$parent.totalDiscount  = 0;

        if( $scope.$parent.form.data.descuento &&  $scope.$parent.form.data.descuento.length> 0){
            $scope.$parent.form.data.descuento.map(function(d){
                $scope.$parent.totalDiscount = $scope.$parent.totalDiscount + d.currency;
            });
        }
    }

    $scope.totalizeDiscountDetail = function(descuento){
        var totalDiscount  = 0;

        if( descuento && descuento.length> 0){
            descuento.map(function(d){
                totalDiscount = totalDiscount + d.currency;
            });
        }

        return totalDiscount;
    }

    $scope.addDiscountRow = function(){
        $scope.discountTable.push({
            percent : 0,
            currency : 0,
            observation : '',
            total : $rootScope.totalInvoice || 0,
            active : true
        });
    }

    $scope.formatPercent = function (){
        return this.discount.percent.toFixed(4);
    }

    $scope.calc = function(key){
        switch (key) {
            case '$':
                var currency =  angular.element(document.getElementById('currency-'+this.$index+''));
                this.discount.percent = (((currency.val() * 100) / $rootScope.totalInvoice));
                break;
            case '%':
                var percent =  angular.element(document.getElementById('percent-'+this.$index+''));
                this.discount.currency = ((percent.val() * $rootScope.totalInvoice) / 100);
                break;
            
            default:
                break;
        }
    }

    $scope.totalizePayments = function(payments){
        var total = 0;

        if(payments && payments.length > 0){

            payments.map(function(r){
                total = (total  + r.valor || 0)
            });

            $rootScope.totalInvoice = total ;
            
            return total;

        }

        return 0;
    }

    $scope.new_record = function(){
        var modal = $modal.open({
            templateUrl: 'views/periodos/new_record.html',
            controller : 'egresosCtrl'
        });
    }

    $scope.tagTransform = function (newTag) {
        var item = {
            name: newTag.toUpperCase()
        };
    
        return item;
      };

    $scope.viewImage = function(){
        $rootScope.selectedImage = this.archivo;
        var modalInstance = $modal.open({
            templateUrl: 'views/modal/viewImage.html',
            controller: 'egresosCtrl',
            windowClass: "hmodal-success"
        }); 
    }


    $scope.$watch('clientFiles', function(n, o){
        if(n){
            const formData = new FormData();
            $scope.uploading =  true;

            Array.from(n).forEach(function(image) {
              formData.append('files', image);
            });
        
            try {
                axios
                .post('http://190.157.105.92:1337/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                })
                .then(function(res){
                    $scope.form.data.archivo = res.data.map(function(files){
                        return files._id;
                    });
                    notify({ message: 'Archivos subidos correctamente...', classes: 'alert-success', templateUrl: 'views/notification/notify.html'});
                    $scope.uploading  = false;
                    $scope.uploadingSuccess = true;
                })
                .catch(function (err) {
                  console.log(err);
                }); 
            } catch (error) {
                
            }
        }
    });

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

     $scope.getDocuments = function(){
        api.periodo().get().then(function(response){
            $rootScope.periodos = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });  
     }
    
    $scope.load = function(){

        if($stateParams.id){
            $scope.recordId = $stateParams.id;

            api.egresos($stateParams.id).get().then(function(response){
                $scope.recordDetail = response.data;
                $rootScope.loading = false;
            }).catch(function(e){
                $rootScope.loading = false;
            });
        }

        api.periodo().add("?_limit=-1").get().then(function(response){
            $rootScope.periodos = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.categoria().add("?_limit=-1").get().then(function(response){
            $scope.categorias = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.terceros().add("?_limit=-1").get().then(function(response){
            $scope.terceros = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.estados_documentos().add("?_limit=-1").get().then(function(response){
            $scope.estados = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });


        api.formasPagos().add("?_limit=-1").get().then(function(response){
            $scope.formasPagos = response.data;
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

    $scope.import = function(){

    }
    
    $scope.addPayment = function(){
        $scope.payments.push({
            valor : $scope.form.data.valor,
            fpago :$scope.selectedFormapago
        });
    }

    $scope.addPaymentEdit = function(){
        $rootScope.formEdit.movimiento =  $rootScope.formEdit.movimiento || [];
        $rootScope.formEdit.movimiento.push({
            valor : $rootScope.formEdit.valor,
            fpago :$scope.selectedFormapago
        });
    }

    $scope.removePayment = function(){
        var index = $scope.payments.indexOf(this.payment);
        
        if(index > -1){
            $scope.payments.splice(index, 1);
        }
    }

    $scope.removePaymentEdit = function(){
        var index = $rootScope.formEdit.movimiento.indexOf(this.payment);
        
        if(index > -1){
            $rootScope.formEdit.movimiento.splice(index, 1);
        }
    }


    $scope.edit_record = function(){
        $rootScope.formEdit = angular.copy(this.record);
        $rootScope.formEdit.estado = $rootScope.formEdit.estado ?  ($rootScope.formEdit.estado = 'Habilitado') : ($rootScope.formEdit.estado = 'Inhabilitado');
        $rootScope.modal = $modal.open({
            templateUrl: 'views/periodos/edit_record.html',
            controller : 'periodosCtrl'
        });
    }

    $scope.update = function(){
        if($scope.formRecordEdit.$valid){
            $rootScope.loading = true;

            var obj = {};

            obj.archivo = $scope.form.data.archivo;
            obj.categoriadto = $rootScope.formEdit.categoriadto._id;
            obj.estadodocumento = $rootScope.formEdit.estadodocumento._id;
            obj.movimiento = $rootScope.formEdit.movimiento;
            
            if($rootScope.formEdit.periodo){
                obj.periodo = $rootScope.formEdit.periodo._id;
            }

            obj.tercero = $rootScope.formEdit.tercero._id;
            obj.referencia = $rootScope.formEdit.referencia;
            obj.recordar = $rootScope.formEdit.recordar;
            obj.recordia = $rootScope.formEdit.recordia;
            obj.observacion = $rootScope.formEdit.observacion;

            $rootScope.modal.close();
            api.periodo($rootScope.formEdit.id).put(obj).then(function(response){
                $rootScope.loading  = false;
                $scope.getDocuments();
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

            $scope.form.data.estado  =  ($scope.form.data.estado == 'Habilitado' ? true : false);

            api.periodo().post($scope.form.data).then(function(response){
                $scope.getDocuments();
                $rootScope.loading = false;
                $scope.homerTemplate = 'views/notification/notify.html';
                delete $scope.form.data;
                notify({ message: 'Registro de periodo creado.', classes: 'alert-success', templateUrl: $scope.homerTemplate});
            }).catch(function(e){
                console.log(e.message);
            });
        }
    }

    $scope.normalize = function(record){
        try {
            if(typeof(record.referencia) === typeof([])){
                return record.referencia.map(function(r){
                    return r.name
                }).join(',');   
            }   
        } catch (error) {
            return 'Sin referencias'
        }
    }

    $scope.normalizeFilename = function(text){
        if(text){
            return text.slice(0, 25) + '...';
        }
    }

    $scope.detail = function(){
       $rootScope.$state.go('campaings.detail_periodo', { id: this.record.id});
    }

    $scope.remove  = function(id){
        api.periodo(id).delete().then(function(response){
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

    $scope.page = function(index){
        $scope.load(index);
    }

    $scope.upload_csv = function(){
        angular.element('#csv').click();
    }

    $scope.$watch('csv_file', function(n, o){
        if(n){
            api.uploadcsv().post($scope.toFormData(data), {
                transformRequest: angular.identity,
                headers: {'Content-Type':undefined, enctype:'multipart/form-data'}}).then(function(rs){
            }).catch(function(e){
                console.log(e);
            });
        }
    });

    $scope.toFormData = function(obj, form, namespace) {
        var fd = form || new FormData();
        var formKey;
        
        for(var property in obj) {
          if(obj.hasOwnProperty(property) && obj[property]) {
            if (namespace) {
              formKey = namespace + '[' + property + ']';
            } else {
              formKey = property;
            }
           
            // if the property is an object, but not a File, use recursivity.
            if (obj[property] instanceof Date) {
              fd.append(formKey, obj[property].toISOString());
            }
            else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
              $scope.toFormData(obj[property], fd, formKey);
            } else { // if it's a string or a File object
              fd.append(formKey, obj[property]);
            }
          }
        }
        
        return fd;
    }

}