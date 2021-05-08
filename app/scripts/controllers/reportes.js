/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('reportesCtrl', reportesCtrl)

function reportesCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert, $http, $filter) {
    $scope.form = {};
    $scope.form.data = {};

    api.estados_documentos().add("?_limit=-1").get().then(function(response){
        $scope.estados = response.data;
    }).catch(function(e){
        $rootScope.loading = false;
    });

    api.tipo_descuentos().add("?_limit=-1").get().then(function(response){
        $scope.descuentos = response.data;
    }).catch(function(e){
        $scope.loading = false;
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

    $scope.openModalFilterEgresos = function(){
        var modal = $modal.open({
            templateUrl: 'views/reportes/filter_egresos.html',
            controller : 'reportesCtrl',
            size: 'lg',
            scope : $scope
        });
    }

    $scope.openModalFilterIngresos = function(){
        var modal = $modal.open({
            templateUrl: 'views/reportes/filter_ingresos.html',
            controller : 'reportesCtrl',
            size: 'lg',
            scope : $scope
        });
    }

    $scope.openModalFilterFacturas = function(){
        var modal = $modal.open({
            templateUrl: 'views/reportes/filter_egresos_facturas.html',
            controller : 'reportesCtrl',
            size: 'lg',
            scope : $scope
        });
    }

    $scope.openModalFilterDiscount  = function(){
        var modal = $modal.open({
            templateUrl: 'views/reportes/filter_discount.html',
            controller : 'reportesCtrl',
            size: 'lg',
            scope : $scope
        });
    }

    $scope.report = function(){
        $http.get('views/print/reporte-egresos-anual.ejs').then(function(res){
            var _template = ejs.render(res.data, { 
                data : $scope.records, 
                fecha : moment(new Date()).format('YYYY-MM-DD') ,
                categoria :$scope.records[0].categoria ,
                empresa : $rootScope.user.empresas[0],
                tercero : $scope.records[0].tercero
            });

            var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
            w.document.write(_template);
        });
    }

    $scope.queryIngreso = function(){
        var filter = "?";
        $scope.loading = true;

        if($scope.form.data.categoria){
            filter += "categoriadto="+$scope.form.data.categoria+"&";
        }

        if($scope.form.data.tercero){
            filter += "tercero="+$scope.form.data.tercero.id+"&";
        }

        if($scope.form.data.estadodocumento){
             filter += "estadodocumento="+$scope.form.data.estadodocumento+"&";
        }

        api.ingresos().add(filter).get().then(function(res){
           $scope.records = res.data || [];
           $scope.loading = false;

           if($scope.records.length > 0){
                var output = _($scope.records).groupBy('tercero.nombre').map(function(ingresos, key){
                    var sumMes = function(data, mes){
                        var total = 0;

                        var rs = data.filter(function(e){

                            if($scope.selectedEstado && $scope.selectedState.descripcion == "Finalizado"){
                                if(e.fechaFinalizado &&  (moment(e.fechaFinalizado ).month() == mes)){
                                    return true
                                }
                            }else{
                                if(e.fechainicial &&  (moment(e.fechainicial ).month() == mes)){
                                    return true
                                }
                            }


                            return false;
                        });

                        for (var index = 0; index < rs.length; index++) {
                            var element = rs[index];
                            if(element.movimiento.length > 0){
                                for (var i = 0;  i < element.movimiento.length; i++) {
                                    var m = element.movimiento[i];
                                    total = total + m.valor || 0;
                                }
                            }
                        }

                        return $filter('currency')(total, '$', 0);
                    }

                    return {
                        tercero : key,
                        categoria : ingresos[0].categoriadto.descripcioncat,
                        ene : sumMes(ingresos, 0),
                        feb : sumMes(ingresos, 1),
                        mar : sumMes(ingresos, 2),
                        abr : sumMes(ingresos, 3),
                        may : sumMes(ingresos, 4),
                        jun : sumMes(ingresos, 5),
                        jul : sumMes(ingresos, 6),
                        ago : sumMes(ingresos, 7),
                        sep : sumMes(ingresos, 8),
                        oct : sumMes(ingresos, 9),
                        nov : sumMes(ingresos, 10),
                        dic : sumMes(ingresos, 11)
                    }
                }).value();

                $scope.records = output;
           }
        });
    }

   $scope.onChangeState = function(id){
        $scope.selectedState = $scope.estados.filter(function(s){
            return s.id  == id;
        })[0]
   }

   $scope.queryDiscount = function(){
    var filter = "?";
    $scope.loading = true;

    if($scope.form.data.categoria){
        filter += "categoriadto="+$scope.form.data.categoria+"&";
    }

    if($scope.form.data.tercero){
        filter += "tercero="+$scope.form.data.tercero.id+"&";
    }

    if($scope.form.data.estadodocumento){
        filter += "estadodocumento="+$scope.form.data.estadodocumento+"&";
    }

    api.egresos().add(filter).get().then(function(res){
       $scope.records = res.data || [];
       $scope.loading = false;

       if($scope.records.length > 0){
            var output = _($scope.records).groupBy('tercero.nombre').map(function(egresos, key){
                var sumMes = function(data, mes){
                    var total = 0;

                    var rs = data.filter(function(e){

                        if($scope.selectedEstado && $scope.selectedState.descripcion == "Finalizado"){
                            if(e.fechaFinalizado &&  (moment(e.fechaFinalizado ).month() == mes)){
                                return true && (e.descuento && e.descuento.filter(function(e){
                                    if(e.observacionObj){
                                        return $scope.form.data.descuento == e.observacionObj.id;
                                    }else{
                                        return false;
                                    }
                                }).length > 0);
                            }
                        }else{
                            if(e.fechainicial &&  (moment(e.fechainicial ).month() == mes)){
                                return true && (e.descuento && e.descuento.filter(function(e){
                                    if(e.observacionObj){
                                        return $scope.form.data.descuento == e.observacionObj.id;
                                    }else{
                                        return false;
                                    }
                                }).length > 0);
                            }
                        }

                        return false;
                    });

                    for (var index = 0; index < rs.length; index++) {
                        var element = rs[index];
                        if(element.descuento.length > 0){
                            for (var i = 0;  i < element.descuento.length; i++) {
                                var m = element.descuento[i];
                                if($scope.form.data.descuento == m.observacionObj.id){
                                    total = total + m.currency || 0;
                                }
                            }
                        }
                    }

                    return $filter('currency')(total, '$', 0);
                }

                return {
                    tercero : key,
                    descuento : $scope.descuentos.filter(function(d){
                        return d.id == $scope.form.data.descuento
                    })[0].descripcion,
                    ene : sumMes(egresos, 0),
                    feb : sumMes(egresos, 1),
                    mar : sumMes(egresos, 2),
                    abr : sumMes(egresos, 3),
                    may : sumMes(egresos, 4),
                    jun : sumMes(egresos, 5),
                    jul : sumMes(egresos, 6),
                    ago : sumMes(egresos, 7),
                    sep : sumMes(egresos, 8),
                    oct : sumMes(egresos, 9),
                    nov : sumMes(egresos, 10),
                    dic : sumMes(egresos, 11)
                }
            }).value();

            $scope.records = output;
       }
    });
}


    
    $scope.queryEgreso = function(){
        var filter = "?";
        $scope.loading = true;

        if($scope.form.data.categoria){
            filter += "categoriadto="+$scope.form.data.categoria+"&";
        }

        if($scope.form.data.tercero){
            filter += "tercero="+$scope.form.data.tercero.id+"&";
        }

        if($scope.form.data.estadodocumento){
            filter += "estadodocumento="+$scope.form.data.estadodocumento+"&";
        }

        api.egresos().add(filter).get().then(function(res){
           $scope.records = res.data || [];
           $scope.loading = false;

           if($scope.records.length > 0){
                var output = _($scope.records).groupBy('tercero.nombre').map(function(egresos, key){
                    var sumMes = function(data, mes){
                        var total = 0;

                        var rs = data.filter(function(e){

                            if($scope.selectedEstado && $scope.selectedState.descripcion == "Finalizado"){
                                if(e.fechaFinalizado &&  (moment(e.fechaFinalizado ).month() == mes)){
                                    return true
                                }
                            }else{
                                if(e.fechainicial &&  (moment(e.fechainicial ).month() == mes)){
                                    return true
                                }
                            }

                            return false;
                        });

                        for (var index = 0; index < rs.length; index++) {
                            var element = rs[index];
                            console.log("elemnt", element);
                            if(element.movimiento.length > 0){
                                for (var i = 0;  i < element.movimiento.length; i++) {
                                    var m = element.movimiento[i];
                                    total = total + m.valor || 0;
                                }
                            }
                        }

                        return $filter('currency')(total, '$', 0);
                    }

                    return {
                        tercero : key,
                        categoria : egresos[0].categoriadto.descripcioncat,
                        ene : sumMes(egresos, 0),
                        feb : sumMes(egresos, 1),
                        mar : sumMes(egresos, 2),
                        abr : sumMes(egresos, 3),
                        may : sumMes(egresos, 4),
                        jun : sumMes(egresos, 5),
                        jul : sumMes(egresos, 6),
                        ago : sumMes(egresos, 7),
                        sep : sumMes(egresos, 8),
                        oct : sumMes(egresos, 9),
                        nov : sumMes(egresos, 10),
                        dic : sumMes(egresos, 11)
                    }
                }).value();

                $scope.records = output;
           }
        });
    }

    $scope.queryEgresoFacturas = function(){
        var filter = "?";
        $scope.loading = true;

        if($scope.form.data.categoria){
            filter += "categoriadto="+$scope.form.data.categoria+"&";
        }

        if($scope.form.data.tercero){
            filter += "tercero="+$scope.form.data.tercero.id+"&";
        }

        if($scope.form.data.estadodocumento){
            filter += "estadodocumento="+$scope.form.data.estadodocumento+"&";
        }

        api.egresos().add(filter).get().then(function(res){
           $scope.records = res.data || [];
           $scope.loading = false;

           if($scope.records.length > 0){
            var sumMes = function(data, mes){
                var total = 0;

                var rs = data.filter(function(e){

                    if($scope.selectedEstado && $scope.selectedState.descripcion == "Finalizado"){
                        if(e.fechaFinalizado &&  (moment(e.fechaFinalizado ).month() == mes)){
                            return true
                        }
                    }else{
                        if(e.fechainicial &&  (moment(e.fechainicial ).month() == mes)){
                            return true
                        }
                    }

                    return false;
                });

                for (var index = 0; index < rs.length; index++) {
                    var element = rs[index];
                    total = total + element.egresodetalle.total;
                }

                return $filter('currency')(total, '$', 0);
            }
               $scope.records = $scope.records.map(function(egreso){
                return  {
                    tercero : egreso.tercero.nombre,
                    categoria : egreso.categoriadto.descripcioncat,
                    ene : sumMes([egreso], 0),
                    feb : sumMes([egreso], 1),
                    mar : sumMes([egreso], 2),
                    abr : sumMes([egreso], 3),
                    may : sumMes([egreso], 4),
                    jun : sumMes([egreso], 5),
                    jul : sumMes([egreso], 6),
                    ago : sumMes([egreso], 7),
                    sep : sumMes([egreso], 8),
                    oct : sumMes([egreso], 9),
                    nov : sumMes([egreso], 10),
                    dic : sumMes([egreso], 11)
                }
               });

           }
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

    $scope.totalizePayments = function(){
        var total = 0;

        if($scope.payments){

            $scope.payments.map(function(r){
                total = (total  + r.valor || 0)
            });

            $rootScope.totalInvoice = total ;
            
            return total;

        }

        return 0;
    }

    $scope.new_record = function(){
        var modal = $modal.open({
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
        api.egresos().get().then(function(response){
            $rootScope.egresos = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });  
     }
    
    $scope.load = function(){
        api.estados_documentos().get().then(function(response){
            $scope.estados = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.formasPagos().get().then(function(response){
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
        $scope.payments = $scope.payments.splice($scope.payments.indexOf(this.payment), 0);
    }

    $scope.removePaymentEdit = function(){
       $rootScope.formEdit.movimiento.splice($rootScope.formEdit.movimiento.indexOf(this.payment), 1);
    }


    $scope.edit_record = function(){
        $rootScope.formEdit = angular.copy(this.record);
        $rootScope.modal = $modal.open({
            templateUrl: 'views/egresos/edit_record.html',
            controller : 'egresosCtrl'
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

            if($scope.discountTable.length > 0){
                $scope.form.data.descuento = $scope.discountTable;
            }

            $scope.form.data.movimiento = $scope.payments;

            if($scope.form.data.referencia){
                $scope.form.data.referencia = $scope.form.data.referencia.map(function(r){
                    delete r.$$hashKey;
                    return r;
                });
            }

            api.egresos().post($scope.form.data).then(function(response){
                $scope.getDocuments();
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