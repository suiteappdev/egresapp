/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('recordsCtrl', recordsCtrl)

function recordsCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
    $scope.modal = null;
    $scope.referencias = [];
    $scope.uploading = false;
    $scope.payments = [];
    $scope.filter = {};


    $scope.form = {
        data : {
            archivos : []
        }
    };

    $scope.impuestos = {
            iva0 : null,
            iva5 : null,
            iva19: null,
            bolsa : null,
            valor_iva0 : null,
            valor_iva5 : null,
            valor_iva19: null,
            descuento : null
    }

    menu.showMenu();

    $scope.uploadFiles = function(){
        $('#files').click();
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

    $scope.new_record = function(){
        var modal = $modal.open({
            backdrop: 'static',
            templateUrl: 'views/ingresos/new_record.html',
            controller : 'recordsCtrl'
        });
    }

    $scope.tagTransform = function (newTag) {
        var item = {
            name: newTag.toUpperCase()
        };
    
        return item;
      };

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
                    $scope.form.data.archivos = res.data.map(function(files){
                        return files;
                    });

                    if($rootScope.formEdit && $rootScope.formEdit.archivos){
                        res.data.map(function(f){
                            $rootScope.formEdit.archivos.push(f)
                        });
                    }

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

    $scope.$watch('formEdit.categoriadto', function(n, o){
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

     $scope.getDocuments = function(id){
        api.ingresos().add("periodo/" + (id ? id : "")).get().then(function(response){
            
            if(response  && response.data.length > 0){
                $rootScope.ingresos = response.data;
                $rootScope.mainLoading = false;
            }

            $rootScope.mainLoading = false;

        }).catch(function(e){
            $rootScope.mainLoading = false;
        });  
     }
    
    $scope.load = function(){

        if($stateParams.id){
            $scope.recordId = $stateParams.id;

            api.ingresos($stateParams.id).get().then(function(response){
                $scope.recordDetail = response.data;
                $scope.loading = false;
            }).catch(function(e){
                $scope.loading = false;
            });
        }

        $scope.loading = true;

        api.saldos().get().then(function(response){
            $rootScope.saldos = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });

        api.periodo().add("?_limit=-1").get().then(function(response){
            $scope.periodos = response.data;
            
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            $scope.getDocuments($scope.selectedPeriodo.id);

            api.saldosIngresos().add('saldos/consolidado/').add("periodo/" + $scope.selectedPeriodo.id).get().then(function(response){
                $rootScope.saldoIngresos = response.data;
                console.log("saldos ingresos",  response.data);
            }).catch(function(e){
                $scope.loading = false;
            });

        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.categoria().add("?_limit=-1").get().then(function(response){
            $scope.categorias = response.data;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.terceros().add("?_limit=-1").get().then(function(response){
            $scope.terceros = response.data;
            $scope.tercerosCatalogo = $scope.terceros;
        }).catch(function(e){
            $scope.loading = false;
        });

        api.estados_documentos().add("?_limit=-1").get().then(function(response){
            $scope.estados = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });


        api.formasPagos().add("?_limit=-1").get().then(function(response){
            $scope.formasPagos = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });
    }

    $scope.getCategory = function(value){
        $scope.terceros = angular.copy($scope.tercerosCatalogo.filter(function(t){
            return  t.categoriadto.id == value;
        }));
    }

    $scope.getByPeriodo = function(id){
        $scope.getDocuments(id);
    }

    $scope.$watch("filter.tercero", function(n, o){
        if(n){
           $scope.getbyTercero(n);
        }
     });

    $scope.getbyTercero = function(id){
        var filter = "?";
        $scope.loading = true;

        if($scope.filter.categoria){
            filter += "categoriadto="+$scope.filter.categoria+"&";
        }

        if($scope.filter.tercero){
            filter += "tercero="+$scope.filter.tercero.id+"&";
        }

        if($scope.filter.estadodocumento){
            filter += "estadodocumento="+$scope.filter.estadodocumento+"&";
        }

        filter += "_limit=-1"


        api.ingresos().add(filter).get().then(function(response){
            if(response  && response.data.length > 0){
                $rootScope.ingresos = response.data;
                $rootScope.mainLoading  = false;
            }
            
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });  
     }

    $scope.getSaldos = function(){
        api.saldosIngresos().add('saldos/consolidado/').add("periodo/" + $scope.filter.periodo).get().then(function(response){
            $rootScope.saldoIngresos = response.data;
        }).catch(function(e){
            $scope.loading = false;
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

    $scope.getPayment = function(value){
        $scope.sp = $scope.formasPagos.filter(function(p){
            if(p.id == value){
                return true
            }
         })[0];
     }
    
    $scope.addPayment = function(){
        $scope.payments.push({
            valor : $scope.form.data.valor,
            fpago :$scope.selectedFormapago,
            tipo : ($scope.form.data && $scope.form.data.bancoMovimiento ? $scope.form.data.bancoMovimiento  : null)
        });

        delete $scope.form.data.bancoMovimiento;
        delete $scope.sp;
        delete $scope.selectedFormapago;
        delete $scope.form.data.fpago;
        delete $scope.form.data.valor
    }

    $scope.addPaymentEdit = function(){
        $rootScope.formEdit.movimiento.push({
            valor : $rootScope.formEdit.valor,
            fpago :$scope.selectedFormapago,
            tipo : ($rootScope.formEdit.data && $rootScope.formEdit.data.bancoMovimiento ? $rootScope.formEdit.data.bancoMovimiento : null)
        });

        delete $scope.formEdit.data.bancoMovimiento;
        delete $scope.sp;
        delete $scope.selectedFormapago;
        delete $scope.form.data.fpago;
        delete $rootScope.formEdit.valor

    }

    $scope.removeFile = function(){
        var archivo   = this.archivo;
        sweetAlert.swal({
            title: "Estas seguro ?",
            text: "Quieres borrar de forma permanente este archivo ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Borrar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    var index = $rootScope.formEdit.archivos.indexOf(archivo);
                    if(index > -1){
                        $rootScope.formEdit.archivos.splice(index, 1);
                        sweetAlert.swal("Borrado", "Archivo borrado", "success"); 
                    }
                } 
            });

    }

    $scope.removeFile_new = function(){
        var archivo   = this.archivo;
        sweetAlert.swal({
            title: "Estas seguro ?",
            text: "Quieres borrar de forma permanente este archivo ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, Borrar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: false,
            closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    var index = $scope.form.data.archivos.indexOf(archivo);
                    if(index > -1){
                        $scope.form.data.archivos.splice(index, 1);
                        sweetAlert.swal("Borrado", "Archivo borrado", "success"); 
                    }
                } 
            });

    }

    $scope.removePayment = function(){
        var index = $scope.payments.indexOf(this.payment);
        
        if(index > -1){
            $scope.payments.splice(index, 1);
        }
    }

    $scope.viewImage = function(){
        $rootScope.selectedImage = this.archivo;

        var modalInstance = $modal.open({
            templateUrl: 'views/modal/viewImage.html',
            controller: 'recordsCtrl',
            size : "lg",
            windowClass: "hmodal-success"
        }); 
    }

    $scope.removePaymentEdit = function(){
       $rootScope.formEdit.movimiento.splice($rootScope.formEdit.movimiento.indexOf(this.payment), 1);
    }


    $scope.edit_record = function(){
        $rootScope.formEdit = angular.copy(this.record);

        $rootScope.impuestos = {
            iva0 : $rootScope.formEdit.impuestos ? $rootScope.formEdit.impuestos.iva0.toString() : "0",
            iva5 : $rootScope.formEdit.impuestos ?  $rootScope.formEdit.impuestos.iva5.toString() : "0",
            iva19 : $rootScope.formEdit.impuestos ? $rootScope.formEdit.impuestos.iva19.toString() : "0",
            bolsa : $rootScope.formEdit.impuestos ?  $rootScope.formEdit.impuestos.bolsa.toString() : "0",
            valor_iva0 : $rootScope.formEdit.impuestos ? $rootScope.formEdit.impuestos.valor_iva0.toString() : "0",
            valor_iva5 : $rootScope.formEdit.impuestos ? $rootScope.formEdit.impuestos.valor_iva5.toString() : "0",
            valor_iva19: $rootScope.formEdit.impuestos ? $rootScope.formEdit.impuestos.valor_iva19.toString() : "0",
            descuento : $rootScope.formEdit.impuestos ? $rootScope.formEdit.impuestos.descuento.toString() : "0"
        }

        console.log("impuestos", $rootScope.impuestos )

        $rootScope.modal = $modal.open({
            backdrop: 'static',
            templateUrl: 'views/ingresos/edit_record.html',
            controller : 'recordsCtrl'
        });
    }

    $scope.update = function(){
        if($scope.formRecordEdit.$valid){
            $rootScope.loading = true;

            var obj = {};

            obj.categoriadto = $rootScope.formEdit.categoriadto;
            obj.estadodocumento = $rootScope.formEdit.estadodocumento;
            obj.movimiento = $rootScope.formEdit.movimiento;
            obj.periodo = $rootScope.formEdit.periodo.id;
            obj.tercero = $rootScope.formEdit.tercero;
            obj.referencia = $rootScope.formEdit.referencia;
            obj.recordar = $rootScope.formEdit.recordar;
            obj.recordia = $rootScope.formEdit.recordia;
            obj.observacion = $rootScope.formEdit.observacion;
            obj.fechafinal = $rootScope.formEdit.fechafinal;
            obj.fechainicial = $rootScope.formEdit.fechainicial;
            
            obj.archivos = $rootScope.formEdit.archivos.map(function(f){
                return f.id;
            });

            if($rootScope.impuestos){
                obj.impuestos  = {
                    bolsa: parseInt($rootScope.impuestos.bolsa || 0),
                    descuento: parseInt($rootScope.impuestos.descuento || 0),
                    iva0: parseInt($rootScope.impuestos.iva0 || 0),
                    iva5:  parseInt($rootScope.impuestos.iva5 || 0),
                    iva19:  parseInt($rootScope.impuestos.iva19 || 0),
                    valor_iva0: parseInt($rootScope.impuestos.valor_iva0 || 0),
                    valor_iva5: parseInt($rootScope.impuestos.valor_iva5 || 0),
                    valor_iva19:parseInt($rootScope.impuestos.valor_iva19 || 0),
                }
            }

            $rootScope.modal.close();

            api.ingresos($rootScope.formEdit.id).put(obj).then(function(response){
                $rootScope.loading  = false;
                $scope.getDocuments($scope.selectedPeriodo.id);
                $scope.getSaldos();
                $scope.homerTemplate = 'views/notification/notify.html';
                notify({ message: 'Registro actualizado con éxito', classes: 'alert-success', templateUrl: $scope.homerTemplate});
            }).catch(function(e){
                $rootScope.modal.close();
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

            $scope.form.data.user = $rootScope.user._id;

            if($scope.form.data.tercero){
                $scope.form.data.tercero = $scope.form.data.tercero._id;
            }

            $scope.form.data.movimiento = $scope.payments;

            if($scope.form.data.referencia){
                $scope.form.data.referencia = $scope.form.data.referencia.map(function(r){
                    delete r.$$hashKey;
                    return r;
                });
            }

            $scope.form.data.impuestos = {
                iva0 : parseInt($scope.impuestos.iva0 || 0),
                iva5 : parseInt($scope.impuestos.iva5 || 0),
                iva19 :  parseInt($scope.impuestos.iva19 || 0),
                bolsa : parseInt($scope.impuestos.bolsa || 0),
                valor_iva0 : parseInt($scope.impuestos.valor_iva0 || 0),
                valor_iva5 : parseInt($scope.impuestos.valor_iva5 || 0),
                valor_iva19:parseInt($scope.impuestos.valor_iva19 || 0),
                descuento : parseInt($scope.impuestos.descuento || 0)
            }

            api.ingresos().post($scope.form.data).then(function(response){
                $scope.getDocuments($scope.selectedPeriodo.id);
                $scope.getSaldos();
                $rootScope.loading = false;
                $scope.homerTemplate = 'views/notification/notify.html';
                notify({ message: 'Registro de ingreso creado.', classes: 'alert-success', templateUrl: $scope.homerTemplate});
                $rootScope.$emit("reload_saldos");
            }).catch(function(e){
                console.log(e.message);
            });
        }
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

    $scope.normalizeFilename = function(text){
        if(text){
            return text.slice(0, 25) + '...';
        }
    }

    $scope.detail = function(){
       $rootScope.$state.go('campaings.detail_ingreso', { id: this.record.id});
    }

    $scope.remove  = function(id){
        api.ingresos(id).delete().then(function(response){
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