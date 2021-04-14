/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('egresosCtrl', egresosCtrl)

function egresosCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
    $scope.modal = null;
    $scope.referencias = [];
    $scope.uploading = false;
    $scope.payments = [];
    $rootScope.discountTable = $rootScope.discount ;
    $scope.detalleDeFactura = []
    $scope.form = {};
    $scope.form.data = {};
    $scope.form.data.archivo = [];
    $scope.filter = {};

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

    $scope.addDiscountEdit = function(){
        var modal = $modal.open({
            templateUrl: 'views/egresos/editDiscount.html',
            controller : 'egresosCtrl',
            scope : $scope
        });
    }

    $scope.formFilter = function(){
        var modal = $modal.open({
            templateUrl: 'views/egresos/filter.html',
            controller : 'egresosCtrl',
            scope : $scope
        });
    }

    $scope.getTotalDiscount  = function(){ 
        if( $rootScope.formEdit.descuento &&  $rootScope.formEdit.descuento.length> 0){
            $rootScope.formEdit.descuento.map(function(d){
                d.observacionObj = $rootScope.descuentos.filter(function(dto){
                    return d.observacion == dto.id;
                })[0];

                if(d.active){
                    $rootScope.totalDiscount = ($rootScope.totalDiscount || 0) + d.currency;
                }

            });
        }
    }

    $scope.applyDiscount = function(){
        $scope.totalizeDiscount();
        $scope.$close();
    }

    $scope.applyDiscountEdit = function(){
        $scope.totalizeDiscountEdit();
        $scope.$close();
    }

    $scope.totalizeDiscount = function(){
        sweetAlert.swal({
            title: "Aplicar decuentos ?",
            text: "Quieres aplicar estos descuentos a la factura ?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#3f5872",
            confirmButtonText: "Si, Aplicar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: true,
            closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    if( $rootScope.discountTable &&  $rootScope.discountTable.length> 0){
                        $rootScope.discountTable.map(function(d){
                            d.observacionObj = $rootScope.descuentos.filter(function(dto){
                                return d.observacion == dto.id;
                            })[0];

                            if(d.active){
                                $rootScope.totalDiscount = ($rootScope.totalDiscount || 0) + d.currency;
                            }
            
                        });
            
                        $rootScope.total = (  $rootScope.total - $rootScope.totalDiscount )
                        $scope.summarize();
                    }
                } 
            });


    }

    $scope.totalizeDiscountEdit = function(){

        sweetAlert.swal({
            title: "Aplicar decuentos ?",
            text: "Quieres aplicar estos descuentos a la factura ?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#3f5872",
            confirmButtonText: "Si, Aplicar!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: true,
            closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    $rootScope.totalDiscount  = 0;

                    if( $rootScope.formEdit.descuento &&  $rootScope.formEdit.descuento.length> 0){
                        $rootScope.formEdit.descuento.map(function(d){
                            if(d.active){
                                $rootScope.totalDiscount = $rootScope.totalDiscount + d.currency;
                            }
                        });

                        $scope.total = ($scope.subtotal + $scope.ivas)  - $rootScope.totalDiscount || 0;
                    }
                } 
            });

    }

    $scope.totalizeDiscountDetail = function(descuento){
        var totalDiscount  = 0;

        if( descuento && descuento.length> 0){
            descuento.map(function(d){
                if(d.active){
                    totalDiscount = totalDiscount + d.currency;
                }
            });
        }

        return totalDiscount;
    }

    $scope.addDiscountRow = function(){
        $rootScope.discountTable = $rootScope.discountTable || []
        $rootScope.discountTable.push({
            percent : 0,
            currency : 0,
            total : $rootScope.totalInvoice || 0,
            active : true
        });
    }

    $scope.addDiscountRowEdit = function(){
        $rootScope.formEdit.descuento = $rootScope.formEdit  && $rootScope.formEdit.descuento.length > 0 ? $rootScope.formEdit.descuento : [];
        $rootScope.formEdit.descuento.push({
            percent : 0,
            currency : 0,
            total : $rootScope.totalInvoice || 0,
            active : true
        });
    }

    $scope.formatPercent = function (){
        return this.discount.percent.toFixed(2);
    }

    $scope.calc = function(key){
        switch (key) {
            case '$':
                var currency =  angular.element(document.getElementById('currency-'+this.$index+''));
                this.discount.percent = (((currency.val() * 100) / $scope.subtotal));
                break;
            case '%':
                var percent =  angular.element(document.getElementById('percent-'+this.$index+''));
                this.discount.currency = ((percent.val() * $scope.subtotal) / 100);
                break;
            
            default:
                break;
        }
    }

    $scope.totalizePayments = function(){
        var total = 0;

        if($scope.payments && $scope.payments .length > 0){

            $scope.payments.map(function(r){
                total = (total  + r.valor || 0)
            });

            $rootScope.totalInvoice = total ;
            
            return total;

        }

        return 0;
    }

    $scope.format = function(){
        return moment(this.record.createdAt).format('LLL');
    }

    $scope.totalizePaymentsEdit = function(payments){
        var total = 0;

        if(payments && payments .length > 0){

            payments.map(function(r){
                total = (total  + r.valor || 0)
            });

            $rootScope.totalInvoice = total ;
            
            return total;

        }

        return 0;
    }

    $scope.new_record = function(){
        $scope.edit_detalle();
        var modal = $modal.open({
            backdrop: 'static',
            templateUrl: 'views/egresos/new_record.html',
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

                    if($rootScope.formEdit && $rootScope.formEdit.archivo){
                        res.data.map(function(f){
                            $rootScope.formEdit.archivo.push(f)
                        });
                    }else{
                        res.data.map(function(f){
                            $scope.form.data.archivo.push(f)
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

     $scope.getDocuments = function(){
        $scope.loading = true;
        api.egresos().get().then(function(response){
            $rootScope.egresos = response.data;
            $scope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });  
     }

     $scope.addToInvoiceEdit = function(){
        if($rootScope.formEdit.fdetalle.conceptos.filter(function(d){
            return d.concepto == $scope.form.data.detalle_factura;
        }).length > 0){
            return sweetAlert.swal("Dato existente", "No se pueden repetir los conceptos ", "warning"); 
        }

        $scope.detalleDeFactura.push({
            valor : $scope.form.data.valor_detalle || 0,
            concepto :$scope.form.data.detalle_factura,
        });

        $scope.summarize();

        delete $scope.form.data.valor_detalle
        delete $scope.form.data.detalle_factura
     }

     $scope.addToInvoice = function(){

        if($scope.detalleDeFactura.filter(function(d){
            return d.concepto == $scope.form.data.detalle_factura;
        }).length > 0){
            return sweetAlert.swal("Dato existente", "No se pueden repetir los conceptos ", "warning"); 
        }

        $scope.detalleDeFactura.push({
            valor : $scope.form.data.valor_detalle || 0,
            concepto :$scope.form.data.detalle_factura,
        });

        $scope.summarize();

        delete $scope.form.data.valor_detalle
        delete $scope.form.data.detalle_factura
     }

     $scope.summarize = function(){
         if( $scope.detalleDeFactura.length > 0){ 

                var total =  $scope.detalleDeFactura.filter(function(d){
                    return (d.concepto == 'SubTotal')
                 }).length > 0 ?  $scope.detalleDeFactura.filter(function(d){
                    return (d.concepto == 'SubTotal')
                 })[0].valor : 0
                
                $scope.subtotal = total

                var iva0 =  $scope.detalleDeFactura.filter(function(d){
                    return (d.concepto == 'Iva 0%')
                 }).length > 0 ?  $scope.detalleDeFactura.filter(function(d){
                    return (d.concepto ==  'Iva 0%')
                 })[0].valor : 0
                
                $scope.iva0 = iva0

                var iva5 =  $scope.detalleDeFactura.filter(function(d){
                    return (d.concepto == 'Iva 5%')
                 }).length > 0 ?  $scope.detalleDeFactura.filter(function(d){
                    return (d.concepto ==  'Iva 5%')
                 })[0].valor : 0
                
                $scope.iva5 = iva5

                var iva19 =  $scope.detalleDeFactura.filter(function(d){
                    return (d.concepto == 'Iva 19%')
                 }).length > 0 ?  $scope.detalleDeFactura.filter(function(d){
                    return (d.concepto ==  'Iva 19%')
                 })[0].valor : 0
                
                $scope.iva19 = iva19

                $scope.ivas = ($scope.iva19  + $scope.iva5  +  $scope.iva0 );
                $scope.total = ($scope.subtotal + $scope.ivas) - ( $rootScope.totalDiscount || 0);

         }else{
             if($rootScope.formEdit.fdetalle.conceptos.length > 0){
                var total = $rootScope.formEdit.fdetalle.conceptos.filter(function(d){
                    return (d.concepto == 'SubTotal')
                 }).length > 0 ?  $rootScope.formEdit.fdetalle.conceptos.filter(function(d){
                    return (d.concepto == 'SubTotal')
                 })[0].valor : 0
                
                $rootScope.subtotal = total
    
                var iva0 =  $rootScope.formEdit.fdetalle.conceptos.filter(function(d){
                    return (d.concepto == 'Iva 0%')
                 }).length > 0 ?  $rootScope.formEdit.fdetalle.conceptos.filter(function(d){
                    return (d.concepto ==  'Iva 0%')
                 })[0].valor : 0
                
                $scope.iva0 = iva0
    
                var iva5 =  $rootScope.formEdit.fdetalle.conceptos.filter(function(d){
                    return (d.concepto == 'Iva 5%')
                 }).length > 0 ?  $rootScope.formEdit.fdetalle.conceptos.filter(function(d){
                    return (d.concepto ==  'Iva 5%')
                 })[0].valor : 0
                
                $scope.iva5 = iva5
    
                var iva19 =  $rootScope.formEdit.fdetalle.conceptos.filter(function(d){
                    return (d.concepto == 'Iva 19%')
                 }).length > 0 ?  $rootScope.formEdit.fdetalle.conceptos.filter(function(d){
                    return (d.concepto ==  'Iva 19%')
                 })[0].valor : 0
                
                $scope.iva19 = iva19
                
                $rootScope.ivas = ($scope.iva19  + $scope.iva5  +  $scope.iva0 );
                $rootScope.total = ($rootScope.subtotal + $scope.ivas) - ($scope.totalDiscount || 0) ;

             }
         }
     }

     $scope.getPayment = function(value){
        $scope.sp = $scope.formasPagos.filter(function(p){
            if(p.id == value){
                return true
            }
         })[0];
     }


    $scope.load = function(){
        $scope.loading = true;

        if($stateParams.id){
            $scope.recordId = $stateParams.id;

            api.egresos($stateParams.id).get().then(function(response){
                $scope.recordDetail = response.data;
            }).catch(function(e){
                $rootScope.loading = false;
            });
        }

        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            $scope.getByPeriodo($scope.filter.periodo);

            api.saldosEgresos().add('saldos/consolidado/periodo/' + $scope.filter.periodo).get().then(function(response){
                $rootScope.saldoEgresos = response.data;
            }).catch(function(e){
                $rootScope.loading = false;
            });

        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.categoria().get().then(function(response){
            $scope.categorias = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });

        api.terceros().get().then(function(response){
            $scope.terceros = response.data;
            $scope.tercerosCatalogo = $scope.terceros;
        }).catch(function(e){
            $scope.loading = false;
        });

        api.estados_documentos().get().then(function(response){
            $scope.estados = response.data;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.tipo_descuentos().get().then(function(response){
            $rootScope.descuentos = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });


        api.formasPagos().get().then(function(response){
            $scope.formasPagos = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });
    }

    $scope.getSaldos = function(){
        api.saldosEgresos().add('saldos/consolidado/periodo/' + $scope.filter.periodo).get().then(function(response){
            $rootScope.saldoEgresos = response.data;
        }).catch(function(e){
            $rootScope.loading = false;
        });
    }

    $scope.getCategory = function(value){
       $scope.terceros = angular.copy($scope.tercerosCatalogo.filter(function(t){
           return  t.categoriadto.id == value;
       }));
    }

    $scope.getByPeriodo = function(id){
        $scope.getEgresos(id);
    }

    $scope.getEgresos = function(id){
        $scope.loading = true;

        api.egresos().add("/periodo/" + (id ? id : "")).get().then(function(response){
            if(response  && response.data.length > 0){
                $rootScope.egresos = response.data;
            }
            
            $scope.loading = false;
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

    $scope.appyFilter = function(){
        var filter = '?';
        $rootScope.loading = true;

        if($rootScope.filter.periodo){
            filter += "periodo="+$rootScope.filter.periodo+"&";
        }

        if($rootScope.filter.categoria){
            filter += "categoriadto="+$rootScope.filter.categoria+"&";
        }

        if($rootScope.filter.estado){
            filter += "estadodocumento="+$rootScope.filter.estado+"&";
        }

        if($rootScope.filter.tercero){
            filter += "tercero="+$rootScope.filter.tercero.id+"&";
        }

        api.egresos().add(filter).get().then(function(res){
            $rootScope.egresos = res.data || [];
            $scope.loading = false;
        })
    }
    
    $scope.addPayment = function(){
        if($rootScope.saldoIngresos.total < $scope.form.data.valor){
            notify({ message: 'No tienes suficiente saldo para hacer este egreso. Se guardara como egreso pendiente.', classes: 'alert-warning', templateUrl: $scope.homerTemplate});
        }

        $scope.payments.push({
            valor : $scope.form.data.valor,
            fpago :$scope.selectedFormapago,
            tipo : $scope.form.data.bancoMovimiento || ''
        });

        delete $scope.form.data.bancoMovimiento;
        delete $scope.sp;
        delete $scope.selectedFormapago;
        delete $scope.form.data.fpago;
        delete $scope.form.data.valor;

        $scope.totalizePayments();

    }

    $scope.addPaymentEdit = function(){
        $rootScope.formEdit.movimiento =  $rootScope.formEdit.movimiento || [];
        $rootScope.formEdit.movimiento.push({
            valor : $rootScope.formEdit.valor,
            fpago :$scope.selectedFormapago,
            tipo : ($rootScope.formEdit.data && $rootScope.formEdit.data.bancoMovimiento ? $rootScope.formEdit.data.bancoMovimiento : null)
        });


        delete $rootScope.formEdit.data.bancoMovimiento;
        delete $scope.sp;
        delete $scope.selectedFormapago;
        delete $scope.form.data.fpago;
        delete $rootScope.formEdit.valor;

    }

    $scope.removePayment = function(){
        var index = $scope.payments.indexOf(this.payment);
        
        if(index > -1){
            $scope.payments.splice(index, 1);
        }
    }

    $scope.removeInvoiceValue = function(){
        var index = $scope.detalleDeFactura.indexOf(this.detalle_valor);
        
        if(index > -1){
            $scope.detalleDeFactura.splice(index, 1);
        }
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
                    var index = $rootScope.formEdit.archivo.indexOf(archivo);
                    if(index > -1){
                        $rootScope.formEdit.archivo.splice(index, 1);
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
                    var index = $scope.form.data.archivo.indexOf(archivo);
                    if(index > -1){
                        $scope.form.data.archivo.splice(index, 1);
                        sweetAlert.swal("Borrado", "Archivo borrado", "success"); 
                    }
                } 
            });

    }

    $scope.removePaymentEdit = function(){
        var index = $rootScope.formEdit.movimiento.indexOf(this.payment);
        
        if(index > -1){
            $rootScope.formEdit.movimiento.splice(index, 1);
        }
    }

    $scope.edit_record = function(){
       $rootScope.formEdit = angular.copy(this.record);
       $scope.summarize();
        $rootScope.modal = $modal.open({
            backdrop: 'static',
            templateUrl: 'views/egresos/edit_record.html',
            controller : 'egresosCtrl'
        });
    }

    $scope.discountSelected = function(discount){
        this.discount.observacion = discount;
    }

    $scope.edit_detalle = function(){
        delete $rootScope.total;
        delete $rootScope.subtotal;
        delete $rootScope.ivas;
        delete $rootScope.totalDiscount;
        delete $scope.total;
        delete $scope.subtotal;
        delete $scope.ivas;

        if($rootScope.formEdit && $rootScope.formEdit.descuento && $rootScope.formEdit.descuento.length > 0){
            $rootScope.formEdit.descuento = [];
        }

        if($rootScope.formEdit &&  $rootScope.formEdit.fdetalle && $rootScope.formEdit.fdetalle.conceptos){
            $rootScope.formEdit.fdetalle.conceptos = [];
        }
    }

    $scope.removeDiscountEdit = function(){
        if($rootScope.formEdit && $rootScope.formEdit.descuento.length > 0){
            var index = $rootScope.formEdit.descuento.indexOf(this.discount);
        
            if(index > -1){
                $rootScope.formEdit.descuento.splice(index, 1);
                $rootScope.totalDiscount  = 0;

                if( $rootScope.formEdit.descuento &&  $rootScope.formEdit.descuento.length> 0){
                    $rootScope.formEdit.descuento.map(function(d){
                        if(d.active){
                            $rootScope.totalDiscount = $rootScope.totalDiscount + d.currency;
                        }
                    });

                    $scope.total = ($scope.subtotal + $scope.ivas)  - $rootScope.totalDiscount || 0;
                }
            }
        }
    }

    $scope.removeDiscount = function(){
        if($rootScope.discountTable && $rootScope.discountTable.length > 0){
            var index = $rootScope.discountTable.indexOf(this.discount);
        
            if(index > -1){
                    $rootScope.discountTable.splice(index, 1);
                    $rootScope.totalDiscount  = $rootScope.totalDiscount - this.discount.currency;
                    $scope.total = ($scope.subtotal + $scope.ivas || 0)  + $rootScope.totalDiscount || 0;
            }
        }
    }

    $scope.update = function(){
        if($scope.formRecordEdit.$valid){
            $rootScope.loading = true;

            var obj = {};

            obj.archivo = $rootScope.formEdit.archivo;
            obj.categoriadto = $rootScope.formEdit.categoriadto._id;
            obj.estadodocumento = $scope.selectedEstado ?  $scope.selectedEstado.id : $rootScope.formEdit.estadodocumento._id;
            obj.movimiento = $rootScope.formEdit.movimiento;
            
            if($rootScope.formEdit.periodo){
                obj.periodo = $rootScope.formEdit.periodo._id;
            }

            if($scope.form.data.archivo && $scope.form.data.archivo.length > 0){
                for (var index = 0; index < $scope.form.data.archivo.length; index++) {
                    var file = $scope.form.data.archivo[index];
                    $scope.formEdit.archivo.push(file);
                }
            }

            var estado  = $scope.estados.filter(function(c){ return c._id == obj.estadodocumento})[0]

            if(($scope.selectedEstado &&  $scope.selectedEstado.descripcion == 'Finalizado') || estado.descripcion == "Finalizado"){
                $rootScope.formEdit.fechaFinalizado = new Date();
                if($scope.form.data.descuento && $scope.form.data.descuento.length > 0){

                    $rootScope.formEdit.egresodetalle = {
                        ivas : $scope.ivas,
                        descuento : $rootScope.totalDiscount,
                        subtotal :  $scope.subtotal,
                        total :   $scope.total
                    }

                }else{
                    $rootScope.formEdit.egresodetalle = {
                        ivas : $scope.ivas,
                        descuento :$rootScope.totalDiscount || 0,
                        subtotal :  $scope.subtotal,
                        total :   $scope.total
                    }
                }
                
                obj.egresodetalle = {
                    ivas : $scope.ivas,
                    descuento : $rootScope.totalDiscount,
                    subtotal :  $scope.subtotal,
                    total :   $scope.total
                }

                obj.fechaFinalizado = $rootScope.formEdit.fechaFinalizado 
            }else{
                $rootScope.formEdit.egresodetalle = {
                    ivas : $scope.ivas,
                    descuento : $rootScope.totalDiscount || 0,
                    subtotal :  $scope.subtotal,
                    total :   $scope.total
                } 
            }

            obj.egresodetalle = {
                ivas : $scope.ivas,
                descuento : $rootScope.totalDiscount,
                subtotal :  $scope.subtotal,
                total :   $scope.total
            }

            obj.fdetalle = {
                conceptos : $scope.detalleDeFactura || [],
                descuento : $rootScope.discount || 0
            }

            obj.tercero = $rootScope.formEdit.tercero._id;
            obj.referencia = $rootScope.formEdit.referencia;
            obj.recordar = $rootScope.formEdit.recordar;
            obj.recordia = $rootScope.formEdit.recordia;
            obj.observacion = $rootScope.formEdit.observacion;
            obj.estadodocumento = estado.id;
            obj.archivo = $rootScope.formEdit.archivo.map(function(f){
                return f.id;
            });

            if($scope.form.data.archivo && $scope.form.data.archivo.length > 0){
                for (var index = 0; index < $scope.form.data.archivo.length; index++) {
                    const file = $scope.form.data.archivo[index];
                    obj.archivo.push(file);
                }
            }

            obj.descuento = $rootScope.formEdit &&  $rootScope.formEdit.descuento ?  $rootScope.formEdit.descuento : []

            $rootScope.modal.close();
            api.egresos($rootScope.formEdit.id).put(obj).then(function(response){
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

            $scope.form.data.user = $rootScope.user._id;

            if($scope.form.data.tercero){
                $scope.form.data.tercero = $scope.form.data.tercero._id;
            }

            if($rootScope.discountTable && $rootScope.discountTable.length > 0){
                $scope.form.data.descuento = $rootScope.discountTable;
            }

            $scope.form.data.movimiento = $scope.payments;

            if($scope.form.data.referencia){
                $scope.form.data.referencia = $scope.form.data.referencia.map(function(r){
                    delete r.$$hashKey;
                    return r;
                });
            }

            if($scope.detalleDeFactura.length > 0){
                $scope.form.data.fdetalle = {
                    conceptos :  $scope.detalleDeFactura,
                    descuento : $rootScope.totalDiscount || 0
                };
            }

            if($scope.form.data.estadodocumento){
                var estado = $scope.estados.filter(function(es){
                    return es.id == $scope.form.data.estadodocumento;
                })[0];

                if($rootScope.saldoIngresos.total < $scope.total && $scope.selectedEstado.descripcion == 'Finalizado'){
                    sweetAlert.swal("Saldo insuficiente!", "No tienes suficiente saldo para hacer este egreso", "error"); 

                    $scope.form.data.estadodocumento = $scope.estados.filter(function(es){
                        return es.descripcion == 'Pendiente';
                    })[0].id;
                }

                if(estado.descripcion == 'Finalizado'){
                    $scope.form.data.fechaFinalizado = new Date();
    
                    if($scope.form.data.descuento && $scope.form.data.descuento.length > 0){
                        $scope.form.data.egresodetalle = {
                            ivas : $scope.ivas,
                            descuento : $rootScope.totalDiscount,
                            subtotal :  $scope.subtotal,
                            total :   $scope.total
                        }
                    }else{
                        $scope.form.data.egresodetalle = {
                            ivas : $scope.ivas,
                            descuento : $rootScope.totalDiscount,
                            subtotal :  $scope.subtotal,
                            total :   $scope.total
                        }
                    }
                }else{
                    $scope.form.data.egresodetalle = {
                        ivas : $scope.ivas,
                        descuento : $rootScope.totalDiscount,
                        subtotal :  $scope.subtotal,
                        total :   $scope.total
                    }  
                }

            }


            api.egresos().post($scope.form.data).then(function(response){
                $scope.getDocuments();
                $scope.getSaldos();
                $rootScope.loading = false;
                $scope.homerTemplate = 'views/notification/notify.html';
                delete $scope.form.data;
                notify({ message: 'Registro de egreso creado.', classes: 'alert-success', templateUrl: $scope.homerTemplate});
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
       $rootScope.$state.go('campaings.detail_egreso', { id: this.record.id});
    }

    $scope.remove  = function(id){
        api.egresos(id).delete().then(function(response){
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