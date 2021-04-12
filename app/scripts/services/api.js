angular
    .module('homer')
    .service('api', api);

function api (constants, $http, $q){

    this.signup = function(data){
        var deferred = $q.defer();
        data.username = data.email;
        
        $http.post(constants.apiHost + 'users', data).then(function(response){
            deferred.resolve(response);
        }).catch(function(e){
            deferred.reject(e);
        });

        return deferred.promise;
    }

    this.login = function(data){
        var deferred = $q.defer();

        $http.post(constants.apiHost+ 'auth/local', data).then(function(response){
            deferred.resolve(response);
        }).catch(function(e){
            deferred.reject(e);
        });

        return deferred.promise;
    }

    this.get = function(){ var url = this.url; this.reset(); return $http.get(url); };
    this.post = function(data, header){  var url = this.url; this.reset(); return $http.post(url, data || {}, header || { headers : {'Content-Type': 'application/json'} }); };
    this.put = function(data, header){ var url = this.url; this.reset(); return $http.put(url, data || {}, header || { headers : {'Content-Type': 'application/json'} }); } ;  
    this.delete = function(){ var url = this.url; this.reset(); return $http.delete(url); };
    
    this.Headers = null;

    this.add = function(comp){ this.url += comp; return this;  };
    this.headers = function(headers){ this.Headers = headers; return this;  };
    this.reset = function(){ this.url = ""; };

    this.campaings = function(campaing){if(campaing) this.url = constants.apiHost + "campaings/" + campaing; else this.url = constants.apiHost + "campaings/"; return this;};
    this.empresa = function(empresa){if(empresa) this.url = constants.apiHost + "empresas/" + empresa; else this.url = constants.apiHost + "empresas/"; return this;};
    this.periodo = function(periodo){if(periodo) this.url = constants.apiHost + "periodos/" + periodo; else this.url = constants.apiHost + "periodos/"; return this;};
    this.estados_documentos = function(documento){if(documento) this.url = constants.apiHost + "estadodocumentos/" + documento; else this.url = constants.apiHost + "estadodocumentos/"; return this;};
    this.ingresos = function(documento){if(documento) this.url = constants.apiHost + "documentos/" + documento; else this.url = constants.apiHost + "documentos/"; return this;};
    this.egresos = function(documento){if(documento) this.url = constants.apiHost + "documentoegresos/" + documento; else this.url = constants.apiHost + "documentoegresos"; return this;};
    this.formasPagos = function(formapago){if(formapago) this.url = constants.apiHost + "fpagos/" + formapago; else this.url = constants.apiHost + "fpagos/"; return this;};
    this.terceros = function(tercero){if(tercero) this.url = constants.apiHost + "terceros/" + tercero; else this.url = constants.apiHost + "terceros/"; return this;};
    this.categoria_padre = function(categoria){if(categoria) this.url = constants.apiHost + "categoria-1-s/" + categoria; else this.url = constants.apiHost + "categoria-1-s/"; return this;};
    this.categoria = function(categoria){if(categoria) this.url = constants.apiHost + "categoriadtos/" + categoria; else this.url = constants.apiHost + "categoriadtos/"; return this;};
    this.sub_categoria = function(categoria){if(categoria) this.url = constants.apiHost + "categoria-2-s/" + categoria; else this.url = constants.apiHost + "categoria-2-s/"; return this;};
    this.administrator = function(admin){if(admin) this.url = constants.apiHost + "administrator/" + admin; else this.url = constants.apiHost + "administrator/"; return this;};
    this.records = function(record){if(record) this.url = constants.apiHost + "records/" + record; else this.url = constants.apiHost + "records/"; return this;};
    this.saldos = function(record){if(record) this.url = constants.apiHost + "saldos/" + record; else this.url = constants.apiHost + "saldos/"; return this;};
    this.users = function(user){if(user) this.url = constants.apiHost + "users/" + user; else this.url = constants.apiHost + "users/"; return this;};
    this.perfil = function(perfil){if(perfil) this.url = constants.apiHost + "perfils/" + perfil; else this.url = constants.apiHost + "perfils/"; return this;};
    this.saldosEgresos = function(record){if(record) this.url = constants.apiHost + "documentoegresos/" + record; else this.url = constants.apiHost + "documentoegresos/"; return this;};
    this.saldosIngresos = function(record){if(record) this.url = constants.apiHost + "documentos/" + record; else this.url = constants.apiHost + "documentos/"; return this;};
    this.tipo_descuentos = function(record){if(record) this.url = constants.apiHost + "tdescuentos/" + record; else this.url = constants.apiHost + "tdescuentos/"; return this;};
    this.upload = function(){ this.url = constants.apiHost + "uploads/"; return this };
   
    return this;
}