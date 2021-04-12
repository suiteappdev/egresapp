angular
    .module('homer')
    .service('menu', menu);

function menu (constants, $http, $q, $timeout){
    this.toggleMenu = function(){
        $timeout(function(){
            if ($(window).width() < 769) {
                $("body").toggleClass("show-sidebar");
            } else {
                $("body").toggleClass("hide-sidebar");
            }
        }, 1000);
    }

    this.toggleMenu = function(classname){
        $timeout(function(){
            if ($(window).width() < 769) {
                $("body").toggleClass('show-sidebar');
            } else {
                $("body").toggleClass('hide-sidebar');
            }
        }, 1000);
    }

    this.showMenu = function(){
        $timeout(function(){
                $("body").removeClass("hide-sidebar" ).addClass( "show-sidebar" );
        }, 1000);
    }

    this.hideMenu = function(){
        $timeout(function(){
                $("body").removeClass("show-sidebar" ).addClass( "hide-sidebar" );
        }, 1000);
    }

    return this;
}