/**
 * HOMER - Responsive Admin Theme
 * version 1.8
 *
 */

$(document).ready(function () {

    // Set minimal height of #wrapper to fit the window
    fixWrapperHeight();

    // Add special class to minimalize page elements when screen is less than 768px
    setBodySmall();

});

$(window).bind("load", function () {

    // Remove splash screen after load
    $('.splash').css('display', 'none')
});

$(window).bind("resize click", function () {

    // Add special class to minimalize page elements when screen is less than 768px
    setBodySmall();

    // Waint until metsiMenu, collapse and other effect finish and set wrapper height
    setTimeout(function () {
        fixWrapperHeight();
    }, 300);
});

function fixWrapperHeight() {

    // Get and set current height
    var headerH = 62;
    var navigationH = $("#navigation").height();
    var contentH = $(".content").height();

    // Set new height when contnet height is less then navigation
    if (contentH < navigationH) {
        $("#wrapper").css("min-height", navigationH + 'px');
    }

    // Set new height when contnet height is less then navigation and navigation is less then window
    if (contentH < navigationH && navigationH < $(window).height()) {
        $("#wrapper").css("min-height", $(window).height() - headerH  + 'px');
    }

    // Set new height when contnet is higher then navigation but less then window
    if (contentH > navigationH && contentH < $(window).height()) {
        $("#wrapper").css("min-height", $(window).height() - headerH + 'px');
    }
}


function setBodySmall() {
    if ($(this).width() < 769) {
        $('body').addClass('page-small');
    } else {
        $('body').removeClass('page-small');
        $('body').removeClass('show-sidebar');
    }
}
/**
 * HOMER - Responsive Admin Theme
 * version 1.8
 *
 */
(function () {
    angular.module('homer', [
        'ui.router',                // Angular flexible routing
        'ngSanitize',               // Angular-sanitize
        'ui.bootstrap',             // AngularJS native directives for Bootstrap
        'angular-flot',             // Flot chart
        'angles',                   // Chart.js
        'angular-peity',            // Peity (small) charts
        'cgNotify',                 // Angular notify
        'angles',                   // Angular ChartJS
        'ngAnimate',                // Angular animations
        'ui.map',                   // Ui Map for Google maps
        'ui.calendar',              // UI Calendar
        'summernote',               // Summernote plugin
        'ngGrid',                   // Angular ng Grid
        'ui.tree',                  // Angular ui Tree
        'bm.bsTour',                // Angular bootstrap tour
        'datatables',               // Angular datatables plugin
        'xeditable',                // Angular-xeditable
        'ui.select',                // AngularJS ui-select
        'ui.sortable',              // AngularJS ui-sortable
        'ui.footable',              // FooTable
        'angular-chartist',         // Chartist
        'ui.codemirror',
        'ngCurrencyMask' ,
        'angularUtils.directives.dirPagination'
    ])
})();


/**
 * HOMER - Responsive Admin Theme
 * version 1.8
 *
 */

function configState($stateProvider, $httpProvider, $urlRouterProvider, $compileProvider, paginationTemplateProvider) {
    paginationTemplateProvider.setPath('views/common/dirPagination.tpl.html');
    $compileProvider.debugInfoEnabled(true);
    $httpProvider.interceptors.push(function($injector, $q) {
        var rootScope = $injector.get('$rootScope');

        return {
            request : function(config){
                $httpProvider.defaults.withCredentials = false;

                if(config.url.includes('/auth/local') && config.method == 'POST'){
                    delete config.headers.Authorization;
                    return config || $q.when(config);
                }else{
                    if(window.localStorage.session){
                        $httpProvider.defaults.headers.common['Authorization'] =  "Bearer " + JSON.parse(window.localStorage.session).jwt ;
                     }
     
                    return config || $q.when(config);
                }
            },
            response : function(response){
                return response;
            },
            responseError : function(rejection){
                return $q.reject(rejection);
            }
        }
    });
    // Set default state
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('signup', {
                url: "/signup",
                templateUrl: "views/common_app/register.html",
                data: {
                    pageTitle: 'Crear cuenta'
                }
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/common_app/login.html",
            data: {
                pageTitle: 'Ingresar'
            }
        })

        // Landing page
        .state('landing', {
            url: "/landing_page",
            templateUrl: "views/landing_page.html",
            data: {
                pageTitle: 'Landing page',
                specialClass: 'landing-page'
            }
        })

        // Dashboard - Main page
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            data: {
                pageTitle: 'Dashboard'
            }
        })

        // Analytics
        .state('analytics', {
            url: "/analytics",
            templateUrl: "views/analytics.html",
            data: {
                pageTitle: 'Analytics'
            }
        })
        .state('campaings', {
            url: "/campaings",
            controller : "dashboardCtrl",
            templateUrl: "views/campaings.html",
            data: {
                pageTitle: 'Campaings'
            }
        })
        .state('campaings.ingresos', {
            url: ":campaing/ingresos",
            controller : "recordsCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/ingresos/records.html",
            params: { role: null},
            data: {
                pageTitle: 'Ingresos'
            }
        })
        .state('campaings.profile', {
            url: ":campaing/perfil",
            controller : "profileCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/perfil/perfil.html",
            data: {
                pageTitle: 'Perfil'
            }
        })
        .state('campaings.perfiles', {
            url: ":campaing/perfiles",
            controller : "perfilesCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/perfiles/perfiles.html",
            data: {
                pageTitle: 'Perfiles'
            }
        })
        .state('campaings.egresos', {
            url: ":campaing/egresos",
            controller : "egresosCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/egresos/records.html",
            params: { role: null},
            data: {
                pageTitle: 'Egresos'
            }
        })
        .state('campaings.reportes', {
            url: ":campaing/reportes",
            controller : "reportesCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/reportes/reportes.html",
            params: { role: null},
            data: {
                pageTitle: 'Reportes'
            }
        })
        .state('campaings.periodos', {
            url: ":campaing/periodos",
            controller : "periodosCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/periodos/periodos.html",
            params: { role: null},
            data: {
                pageTitle: 'Periodos'
            }
        })
        .state('campaings.formas_pagos', {
            url: ":campaing/formas-de-pagos",
            controller : "formas_pagosCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/formas_pagos/formas_pagos.html",
            params: { role: null},
            data: {
                pageTitle: 'Formas de pagos'
            }
        })
        .state('campaings.usuarios', {
            url: ":campaing/usuarios",
            controller : "usuariosCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/usuarios/usuarios.html",
            params: { role: null},
            data: {
                pageTitle: 'Usuarios'
            }
        })
        .state('campaings.terceros', {
            url: ":campaing/terceros",
            controller : "tercerosCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/terceros/terceros.html",
            params: { role: null},
            data: {
                pageTitle: 'Terceros'
            }
        })
        .state('campaings.categorias', {
            url: ":campaing/categorias",
            controller : "categoriasCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/categorias/categorias.html",
            params: { role: null},
            data: {
                pageTitle: 'categorias'
            }
        })
        .state('campaings.subcategorias', {
            url: ":campaing/subcategorias",
            controller : "subcategoriasCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/subcategorias/subcategorias.html",
            params: { role: null},
            data: {
                pageTitle: 'Subcategorias'
            }
        })
        .state('campaings.categorias_documentos', {
            url: ":campaing/categorias_documentos",
            controller : "categorias_documentosCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/categorias_documentos/categorias_documentos.html",
            params: { role: null},
            data: {
                pageTitle: 'Categorias documentos'
            }
        })
        .state('recover', {
            url: "/recover",
            templateUrl: "views/common_app/recover.html",
            params: { role: null},
            data: {
                pageTitle: 'Recuperar contraseña'
            }
        })
        .state('campaings.detail_ingreso', {
            url: ":campaing/detalle-ingreso/:id",
            controller : "recordsCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/ingresos/detail.html",
            params: { ingreso: null, id : null},
            data: {
                pageTitle: 'Detalles Ingreso'
            }
        })

        .state('campaings.detail_egreso', {
            url: ":campaing/detalle-egreso/:id",
            controller : "egresosCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/egresos/detail.html",
            params: { ingreso: null, id : null},
            data: {
                pageTitle: 'Detalles'
            }
        })
        .state('campaings.detail_periodo', {
            url: ":campaing/detalle-periodo/:id",
            controller : "periodosCtrl",
            access: { requiredAuthentication: true },
            templateUrl: "views/periodos/detail.html",
            params: { ingreso: null, id : null},
            data: {
                pageTitle: 'Detalles'
            }
        })
        // Widgets
        .state('widgets', {
            url: "/widgets",
            templateUrl: "views/widgets.html",
            data: {
                pageTitle: 'Widgets'
            }
        })

        // Widgets
        .state('options', {
            url: "/options",
            templateUrl: "views/options.html",
            data: {
                pageTitle: 'Options',
                pageDesc: 'Example small header for demo purpose.'
            }
        })

        // Interface
        .state('interface', {
            abstract: true,
            url: "/interface",
            templateUrl: "views/common/content.html",
            data: {
                pageTitle: 'Interface'
            }
        })
        .state('interface.buttons', {
            url: "/buttons",
            templateUrl: "views/interface/buttons.html",
            data: {
                pageTitle: 'Colors and Buttons',
                pageDesc: 'The basic color palette'
            }
        })
        .state('interface.typography', {
            url: "/typography",
            templateUrl: "views/interface/typography.html",
            data: {
                pageTitle: 'Typography',
                pageDesc: 'The basic elements of typography'
            }
        })
        .state('interface.components', {
            url: "/components",
            templateUrl: "views/interface/components.html",
            data: {
                pageTitle: 'Components',
                pageDesc: 'Tabs, according, collapse and other UI components'
            }
        })
        .state('interface.icons', {
            url: "/icons",
            templateUrl: "views/interface/icons.html",
            data: {
                pageTitle: 'Icons',
                pageDesc: 'Two great icon libraries. Pe-icon-7-stroke and Font Awesome'
            }
        })
        .state('interface.panels', {
            url: "/panels",
            templateUrl: "views/interface/panels.html",
            data: {
                pageTitle: 'Panels',
                pageDesc: 'Two great icon libraries. Pe-icon-7-stroke and Font Awesome'
            }
        })
        .state('interface.alerts', {
            url: "/alerts",
            templateUrl: "views/interface/alerts.html",
            data: {
                pageTitle: 'Alerts',
                pageDesc: 'Notification and custom alerts'
            }
        })
        .state('interface.modals', {
            url: "/modals",
            templateUrl: "views/interface/modals.html",
            data: {
                pageTitle: 'Modals',
                pageDesc: 'Modal window examples'
            }
        })
        .state('interface.list', {
            url: "/list",
            templateUrl: "views/interface/list.html",
            data: {
                pageTitle: 'Nestable list',
                pageDesc: 'Nestable - Drag & drop hierarchical list.'
            }
        })

        .state('interface.tour', {
            url: "/tour",
            templateUrl: "views/interface/tour.html",
            data: {
                pageTitle: 'Tour',
                pageDesc: 'The easiest way to show people how to use your website.'
            }
        })

        .state('interface.draggable_panels', {
            url: "/draggable_panels",
            templateUrl: "views/interface/draggable_panels.html",
            data: {
                pageTitle: 'Draggable panels',
                pageDesc: 'Example page for draggable panels'
            }
        })

        .state('interface.code_editor', {
            url: "/code_editor",
            templateUrl: "views/interface/code_editor.html",
            data: {
                pageTitle: 'Code editor',
                pageDesc: 'Versatile text editor implemented in JavaScript for the browser.'
            }
        })

        // App views
        .state('app_views', {
            abstract: true,
            url: "/app_views",
            templateUrl: "views/common/content.html",
            data: {
                pageTitle: 'App Views'
            }
        })
        .state('app_views.timeline', {
            url: "/timeline",
            templateUrl: "views/app_views/timeline.html",
            data: {
                pageTitle: 'Timeline',
                pageDesc: 'Present your events in timeline style.'
            }
        })
        .state('app_views.contacts', {
            url: "/contacts",
            templateUrl: "views/app_views/contacts.html",
            data: {
                pageTitle: 'Contacts',
                pageDesc: 'Show users list in nice and color panels'
            }
        })
        .state('app_views.profile', {
            url: "/profile",
            templateUrl: "views/app_views/profile.html",
            data: {
                pageTitle: 'Profile',
                pageDesc: 'Show user data in clear profile design'
            }
        })
        .state('app_views.calendar', {
            url: "/calendar",
            templateUrl: "views/app_views/calendar.html",
            data: {
                pageTitle: 'Calendar',
                pageDesc: 'Full-sized, drag & drop event calendar.'
            }
        })
        .state('app_views.projects', {
            url: "/projects",
            templateUrl: "views/app_views/projects.html",
            data: {
                pageTitle: 'Projects',
                pageDesc: 'List of projects.'
            }
        })
        .state('app_views.project_detail', {
            url: "/project_detail",
            templateUrl: "views/app_views/project_detail.html",
            data: {
                pageTitle: 'Project detail',
                pageDesc: 'Special page for project detail.'
            }
        })
        .state('app_views.app_plans', {
            url: "/app_plans",
            templateUrl: "views/app_views/app_plans.html",
            data: {
                pageTitle: 'App plans',
                pageDesc: 'Present pricing option for your app'
            }
        })
        .state('app_views.social_board', {
            url: "/social_board",
            templateUrl: "views/app_views/social_board.html",
            data: {
                pageTitle: 'Social board',
                pageDesc: 'Message board for social interactions.'
            }
        })
        .state('app_views.blog', {
            url: "/blog",
            templateUrl: "views/app_views/blog.html",
            data: {
                pageTitle: 'Blog',
                pageDesc: 'Article board for blog page.'
            }
        })
        .state('blog_details', {
            url: "/blog_details",
            templateUrl: "views/app_views/blog_details.html",
            data: {
                pageTitle: 'Article',
                pageDesc: 'Article blog page.'
            }
        })
        .state('app_views.forum', {
            url: "/forum",
            templateUrl: "views/app_views/forum.html",
            data: {
                pageTitle: 'Forum',
                pageDesc: 'Topics board for forum page.'
            }
        })
        .state('app_views.forum_details', {
            url: "/forum_details",
            templateUrl: "views/app_views/forum_details.html",
            data: {
                pageTitle: 'Topic',
                pageDesc: 'Topic for forum page.'
            }
        })
        .state('app_views.gallery', {
            url: "/gallery",
            templateUrl: "views/app_views/gallery.html",
            data: {
                pageTitle: 'Galery',
                pageDesc: 'Touch-enabled, responsive and customizable image & video gallery.'
            }
        })

        .state('app_views.notes', {
            url: "/notes",
            templateUrl: "views/app_views/notes.html",
            data: {
                pageTitle: 'Notes',
                pageDesc: 'Build notebook functionality in your app'
            }
        })

        .state('app_views.mailbox', {
            url: "/mailbox",
            templateUrl: "views/app_views/mailbox.html",
            data: {
                pageTitle: 'Mailbox',
                pageDesc: 'Mailbox - Email list.'
            }
        })

        .state('app_views.faq', {
            url: "/faq",
            templateUrl: "views/app_views/faq.html",
            data: {
                pageTitle: 'FAQ',
                pageDesc: 'FAQ page - build faq/support page for your app'
            }
        })

        .state('app_views.email_compose', {
            url: "/email_compose",
            templateUrl: "views/app_views/email_compose.html",
            data: {
                pageTitle: 'Mailbox',
                pageDesc: 'Mailbox - Email compose.'
            }
        })

        .state('app_views.email_view', {
            url: "/email_view",
            templateUrl: "views/app_views/email_view.html",
            data: {
                pageTitle: 'Mailbox',
                pageDesc: 'Mailbox - Email view.'
            }
        })

        .state('app_views.invoice', {
            url: "/invoice",
            templateUrl: "views/app_views/invoice.html",
            data: {
                pageTitle: 'Invoice',
                pageDesc: 'Clean invoice template.'
            }
        })

        .state('app_views.file_manager', {
            url: "/mailbox",
            templateUrl: "views/app_views/file_manager.html",
            data: {
                pageTitle: 'File manager',
                pageDesc: 'Show you files in a nica manager design.'
            }
        })

        .state('app_views.search', {
            url: "/search",
            templateUrl: "views/app_views/search.html",
            data: {
                pageTitle: 'Search view',
                pageDesc: 'Use search view to show search functionality.'
            }
        })

        .state('app_views.chat_view', {
            url: "/chat_view",
            templateUrl: "views/app_views/chat_view.html",
            data: {
                pageTitle: 'Chat view',
                pageDesc: 'Create a chat room in your app'
            }
        })

        // Transitions
        .state('transitions', {
            abstract: true,
            url: "/transitions",
            templateUrl: "views/common/content_blank.html",
            data: {
                pageTitle: 'Transitions'
            }
        })
        .state('transitions.overview', {
            url: "/overview",
            templateUrl: "views/transitions/overview.html",
            data: {
                pageTitle: 'Overview of transitions Effect'
            }
        })
        .state('transitions.transition_one', {
            url: "/transition_one",
            templateUrl: "views/transitions/transition_one.html"
        })
        .state('transitions.transition_two', {
            url: "/transition_two",
            templateUrl: "views/transitions/transition_two.html"
        })
        .state('transitions.transition_three', {
            url: "/transition_three",
            templateUrl: "views/transitions/transition_three.html"
        })
        .state('transitions.transition_four', {
            url: "/transition_four",
            templateUrl: "views/transitions/transition_four.html"
        })
        .state('transitions.transition_five', {
            url: "/transition_five",
            templateUrl: "views/transitions/transition_five.html"
        })

        // Charts
        .state('charts', {
            abstract: true,
            url: "/charts",
            templateUrl: "views/common/content.html",
            data: {
                pageTitle: 'Charts'
            }
        })
        .state('charts.flot', {
            url: "/flot",
            templateUrl: "views/charts/flot.html",
            data: {
                pageTitle: 'Flot chart',
                pageDesc: 'Flot is a pure JavaScript plotting library for jQuery, with a focus on simple usage, attractive looks and interactive features.'
            }
        })
        .state('charts.chartjs', {
            url: "/chartjs",
            templateUrl: "views/charts/chartjs.html",
            data: {
                pageTitle: 'ChartJS',
                pageDesc: 'Simple HTML5 Charts using the canvas element'
            }
        })
        .state('charts.inline', {
            url: "/inline",
            templateUrl: "views/charts/inline.html",
            data: {
                pageTitle: 'Inline charts',
                pageDesc: 'Small inline charts directly in the browser using data supplied in the controller.'
            }
        })

        .state('charts.chartist', {
            url: "/chartist",
            templateUrl: "views/charts/chartist.html",
            data: {
                pageTitle: 'Chartist',
                pageDesc: 'Chartist.js is a simple responsive charting library built with SVG.'
            }
        })

        // Common views
        .state('common', {
            abstract: true,
            url: "/common",
            templateUrl: "views/common/content_empty.html",
            data: {
                pageTitle: 'Common'
            }
        })
        .state('common.login', {
            url: "/login",
            templateUrl: "views/common_app/login.html",
            data: {
                pageTitle: 'Ingresar',
                specialClass: 'blank'
            }
        })
        .state('common.register', {
            url: "/register",
            templateUrl: "views/common_app/register.html",
            data: {
                pageTitle: 'Register page',
                specialClass: 'blank'
            }
        })
        .state('common.error_one', {
            url: "/error_one",
            templateUrl: "views/common_app/error_one.html",
            data: {
                pageTitle: 'Error 404',
                specialClass: 'blank'
            }
        })
        .state('common.error_two', {
            url: "/error_two",
            templateUrl: "views/common_app/error_two.html",
            data: {
                pageTitle: 'Error 505',
                specialClass: 'blank'
            }
        })
        .state('common.lock', {
            url: "/lock",
            templateUrl: "views/common_app/lock.html",
            data: {
                pageTitle: 'Lock page',
                specialClass: 'blank'
            }
        })
        // Tables views
        .state('tables', {
            abstract: true,
            url: "/tables",
            templateUrl: "views/common/content.html",
            data: {
                pageTitle: 'Tables'
            }
        })
        .state('tables.tables_design', {
            url: "/tables_design",
            templateUrl: "views/tables/tables_design.html",
            data: {
                pageTitle: 'Tables design',
                pageDesc: 'Examples of various designs of tables.'
            }
        })
        .state('tables.ng_grid', {
            url: "/ng_grid",
            templateUrl: "views/tables/ng_grid.html",
            data: {
                pageTitle: 'ngGgrid',
                pageDesc: 'Examples of various designs of tables.'
            }
        })
        .state('tables.datatables', {
            url: "/datatables",
            templateUrl: "views/tables/datatables.html",
            data: {
                pageTitle: 'DataTables',
                pageDesc: 'Advanced interaction controls to any HTML table'
            }
        })
        .state('tables.footable', {
            url: "/footable",
            templateUrl: "views/tables/footable.html",
            data: {
                pageTitle: 'FooTable',
                pageDesc: 'Advanced interaction controls to any HTML table'
            }
        })

        // Forms views
        .state('forms', {
            abstract: true,
            url: "/forms",
            templateUrl: "views/common/content_small.html",
            data: {
                pageTitle: 'Forms'
            }
        })
        .state('forms.forms_elements', {
            url: "/forms_elements",
            templateUrl: "views/forms/forms_elements.html",
            data: {
                pageTitle: 'Forms elements',
                pageDesc: 'Examples of various form controls.'
            }
        })
        .state('forms.forms_extended', {
            url: "/forms_extended",
            templateUrl: "views/forms/forms_extended.html",
            data: {
                pageTitle: 'Forms extended',
                pageDesc: 'Examples of various extended form controls.'
            }
        })
        .state('forms.text_editor', {
            url: "/text_editor",
            templateUrl: "views/forms/text_editor.html",
            data: {
                pageTitle: 'Text editor',
                pageDesc: 'Examples of text editor.'
            }
        })
        .state('forms.wizard', {
            url: "/wizard",
            templateUrl: "views/forms/wizard.html",
            data: {
                pageTitle: 'Wizard',
                pageDesc: 'Build a form with wizard functionality.'
            }
        })

        .state('forms.validation', {
            url: "/validation",
            templateUrl: "views/forms/validation.html",
            data: {
                pageTitle: 'Validation',
                pageDesc: 'Build a form with validation functionality.'
            }
        })

        // Grid system
        .state('grid_system', {
            url: "/grid_system",
            templateUrl: "views/grid_system.html",
            data: {
                pageTitle: 'Grid system'
            }
        })
}

angular
    .module('homer')
    .config(configState)
    .run(function($rootScope, $state, editableOptions, $window, constants) {
        $rootScope.$state = $state;
        $rootScope.$constants = constants;
        $rootScope.usuarios  = [];

        $rootScope.user = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).user : null
        $rootScope.roles = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).roles : null
        
        $rootScope.logout = function(){
            localStorage.clear();
            $state.go('login');
        }

        editableOptions.theme = 'bs3';
        //$("body").toggleClass("hide-sidebar");

        $rootScope.$on('$stateChangeStart', function(event, nextRoute, toParams, fromState, fromParams){
            console.log('$stateChangeStart', nextRoute);
            if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !localStorage.getItem('session')) {
                event.preventDefault();
                nextRoute.data.pageTitle = "Entrar";
                $state.transitionTo('login');
                return;
             }
        });
    });
/**
 *
 * propsFilter
 *
 */

angular
    .module('homer')
    .filter('propsFilter', propsFilter)

function propsFilter(){
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
}
angular.module('homer').filter('customCurrency', function ($filter) {       
    return function(amount, currencySymbol){
       var currency = $filter('currency');         
  
       if(amount.charAt(0) === "-"){
          return currency(amount, currencySymbol)
            .replace("(", "-")
            .replace(")", ""); 
       }
  
       return currency(amount, currencySymbol);
    };
  });
angular.module('homer').filter('moment', function (){
    return function (input, momentFn) {
      var args = Array.prototype.slice.call(arguments, 2),
          momentObj = moment(input);
      return momentObj[momentFn].apply(momentObj, args);
    };
  });
/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */

angular
    .module('homer')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('minimalizaMenu', minimalizaMenu)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('panelTools', panelTools)
    .directive('panelToolsFullscreen', panelToolsFullscreen)
    .directive('smallHeader', smallHeader)
    .directive('animatePanel', animatePanel)
    .directive('landingScrollspy', landingScrollspy)
    .directive('datePicker', datePicker)
    .directive('reader', reader)

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title
                var title = 'SUITEAPP | EGRESAPP';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'EGRESAPP v1.0.5 | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

function datePicker($rootScope, $timeout) {
    function ctrl ($scope){

        $scope.today = function() {
            $scope.dt = new Date();
        };
        
        $scope.today();
    
        $scope.clear = function () {
            $scope.dt = null;
        };
    
        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };
    
        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        
        $scope.toggleMin();
    
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
    
            $scope.opened = true;
        };
    
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
    
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    }  

    return {
        restrict : "EA",
        scope : {
            ngModel : "=",
            required : "@"
        },
        templateUrl: 'views/fields/datepicker.html',
        controller : ctrl
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            element.metisMenu();

            // Colapse menu in mobile mode after click on element
            var menuElement = $('#side-menu a:not([href$="\\#"])');
            menuElement.click(function(){

                if ($(window).width() < 769) {
                    $("body").toggleClass("show-sidebar");
                }
            });


        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaMenu($rootScope, $timeout) {
    return {
        restrict: 'EA',
        template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
            if ($(window).width() < 769) {
                    $("body").toggleClass("show-sidebar");
                } else {
                    $("body").toggleClass("hide-sidebar");
                }
            }
        }
    };
};


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
            });
        }
    };
}


/**
 * panelTools - Directive for panel tools elements in right corner of panel
 */
function panelTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/panel_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                var body = hpanel.find('div.panel-body');
                var footer = hpanel.find('div.panel-footer');
                body.slideToggle(300);
                footer.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                hpanel.toggleClass('').toggleClass('panel-collapse');
                $timeout(function () {
                    hpanel.resize();
                    hpanel.find('[id^=map-]').resize();
                }, 50);
            },

            // Function for close ibox
            $scope.closebox = function () {
                var hpanel = $element.closest('div.hpanel');
                hpanel.remove();
            }

        }
    };
};

/**
 * panelToolsFullscreen - Directive for panel tools elements in right corner of panel with fullscreen option
 */
function panelToolsFullscreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/panel_tools_fullscreen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                var body = hpanel.find('div.panel-body');
                var footer = hpanel.find('div.panel-footer');
                body.slideToggle(300);
                footer.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                hpanel.toggleClass('').toggleClass('panel-collapse');
                $timeout(function () {
                    hpanel.resize();
                    hpanel.find('[id^=map-]').resize();
                }, 50);
            };

            // Function for close ibox
            $scope.closebox = function () {
                var hpanel = $element.closest('div.hpanel');
                hpanel.remove();
            }

            // Function for fullscreen
            $scope.fullscreen = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                $('body').toggleClass('fullscreen-panel-mode');
                icon.toggleClass('fa-expand').toggleClass('fa-compress');
                hpanel.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }

        }
    };
};

/**
 * smallHeader - Directive for page title panel
 */
function smallHeader() {
    return {
        restrict: 'A',
        scope:true,
        controller: function ($scope, $element) {
            $scope.small = function() {
                var icon = $element.find('i:first');
                var breadcrumb  = $element.find('#hbreadcrumb');
                $element.toggleClass('small-header');
                breadcrumb.toggleClass('m-t-lg');
                icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
            }
        }
    }
}

function animatePanel($timeout,$state) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            //Set defaul values for start animation and delay
            var startAnimation = 0;
            var delay = 0.06;   // secunds
            var start = Math.abs(delay) + startAnimation;

            // Store current state where directive was start
            var currentState = $state.current.name;

            // Set default values for attrs
            if(!attrs.effect) { attrs.effect = 'zoomIn'};
            if(attrs.delay) { delay = attrs.delay / 10 } else { delay = 0.06 };
            if(!attrs.child) { attrs.child = '.row > div'} else {attrs.child = "." + attrs.child};

            // Get all visible element and set opactiy to 0
            var panel = element.find(attrs.child);
            panel.addClass('opacity-0');

            // Count render time
            var renderTime = panel.length * delay * 1000 + 700;

            // Wrap to $timeout to execute after ng-repeat
            $timeout(function(){

                // Get all elements and add effect class
                panel = element.find(attrs.child);
                panel.addClass('stagger').addClass('animated-panel').addClass(attrs.effect);

                var panelsCount = panel.length + 10;
                var animateTime = (panelsCount * delay * 10000) / 10;

                // Add delay for each child elements
                panel.each(function (i, elm) {
                    start += delay;
                    var rounded = Math.round(start * 10) / 10;
                    $(elm).css('animation-delay', rounded + 's');
                    // Remove opacity 0 after finish
                    $(elm).removeClass('opacity-0');
                });

                // Clear animation after finish
                $timeout(function(){
                    $('.stagger').css('animation', '');
                    $('.stagger').removeClass(attrs.effect).removeClass('animated-panel').removeClass('stagger');
                }, animateTime)

            });



        }
    }
}

function landingScrollspy(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}

function reader (){
    return {
        require:'ngModel',
        scope: {
            reader: "="
        },
        link: function (scope, element, attributes, ngModel) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.reader = changeEvent.target.files;
                    ngModel.$setViewValue(element.val());
                    ngModel.$render();
                });
            });
        }
    }
}


angular
    .module('homer')
    .directive('currencyMask', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
        
        var formatNumber = function(value) {
       
          value = value.toString();
          value = value.replace(/[^0-9\.]/g, "");
          var parts = value.split('.');
          parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
          if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].substring(0, 2);
          }
         
          return parts.join(".");
        };
        var applyFormatting = function() {
          var value = element.val();
          var original = value;
          if (!value || value.length == 0) {
            return
          }
          value = formatNumber(value);
          if (value != original) {
            element.val(value);
            element.triggerHandler('input')
          }
        };
        element.bind('keyup', function(e) {
          var keycode = e.keyCode;
          var isTextInputKey =
            (keycode > 47 && keycode < 58) || // number keys
            keycode == 32 || keycode == 8 || // spacebar or backspace
            (keycode > 64 && keycode < 91) || // letter keys
            (keycode > 95 && keycode < 112) || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223); // [\]' (in order)
          if (isTextInputKey) {
            applyFormatting();
          }
        });
        element.bind('blur', function(evt) {
          if (angular.isDefined(ngModelController.$modelValue)) {
            var val = ngModelController.$modelValue.split('.');
            if (val && val.length == 1) {
              if (val != "") {
                ngModelController.$setViewValue(val + '.00');
                ngModelController.$render();
              }
            } else if (val && val.length == 2) {
              if (val[1] && val[1].length == 1) {
                ngModelController.$setViewValue(val[0] + '.' + val[1] + '0');
                ngModelController.$render();
              } else if (val[1].length == 0) {
                ngModelController.$setViewValue(val[0] + '.00');
                ngModelController.$render();
              }
              applyFormatting();
            }
          }
        })
        ngModelController.$parsers.push(function(value) {
          if (!value || value.length == 0) {
            return value;
          }
          value = value.toString();
          value = value.replace(/[^0-9\.]/g, "");
          return value;
        });
        ngModelController.$formatters.push(function(value) {
          if (!value || value.length == 0) {
            return value;
          }
          value = formatNumber(value);
          return value;
        });
      }
    };
  });



angular
    .module('homer')
    .constant('constants', {
        apiHost : "http://190.157.105.92:1337/"
        //apiHost : "http://190.157.105.92:1337/"
    });
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
/**
 *
 * appCtrl
 *
 */

angular
    .module('homer')
    .controller('appCtrl', appCtrl);

function appCtrl($http, $scope, $timeout) {

    // For iCheck purpose only
    $scope.checkOne = true;

    /**
     * Sparkline bar chart data and options used in under Profile image on left navigation panel
     */

    $scope.barProfileData = [5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 11, 4];
    $scope.barProfileOptions = {
        type: 'bar',
        barWidth: 7,
        height: '30px',
        barColor: '#62cb31',
        negBarColor: '#53ac2a'
    };
    $scope.chartIncomeData = [
        {
            label: "line",
            data: [ [1, 10], [2, 26], [3, 16], [4, 36], [5, 32], [6, 51] ]
        }
    ];

    $scope.chartIncomeOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 0,
                fill: true,
                fillColor: "#64cc34"

            }
        },
        colors: ["#62cb31"],
        grid: {
            show: false
        },
        legend: {
            show: false
        }
    };

    /**
     * Tooltips and Popover - used for tooltips in components view
     */
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.htmlTooltip = "I\'ve been made <b>bold</b>!";
    $scope.dynamicTooltipText  = 'Dynamic';
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverTitle = 'Title';

    /**
     * Pagination - used for pagination in components view
     */
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    /**
     * Typehead - used for typehead in components view
     */
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocation = function(val) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false
            }
        }).then(function(response){
                return response.data.results.map(function(item){
                    return item.formatted_address;
                });
            });
    };

    /**
     * Rating - used for rating in components view
     */
    $scope.rate = 7;
    $scope.max = 10;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / this.max);
    };

    /**
     * groups - used for Collapse panels in Tabs and Panels view
     */
    $scope.groups = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. '
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. '
        }
    ];

    $scope.oneAtATime = true;

    /**
     * Some Flot chart data and options used in Dashboard
     */

    var data1 = [ [0, 55], [1, 48], [2, 40], [3, 36], [4, 40], [5, 60], [6, 50], [7, 51] ];
    var data2 = [ [0, 56], [1, 49], [2, 41], [3, 38], [4, 46], [5, 67], [6, 57], [7, 59] ];

    $scope.chartUsersData = [data1, data2];
    $scope.chartUsersOptions = {
        series: {
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
        },
        grid: {
            tickColor: "#f0f0f0",
            borderWidth: 1,
            borderColor: 'f0f0f0',
            color: '#6a6c6f'
        },
        colors: [ "#62cb31", "#efefef"],
    };


    /**
     * Some Pie chart data and options
     */

    $scope.PieChart = {
        data: [1, 5],
        options: {
            fill: ["#62cb31", "#edf0f5"]
        }
    };

    $scope.PieChart2 = {
        data: [226, 360],
        options: {
            fill: ["#62cb31", "#edf0f5"]
        }
    };
    $scope.PieChart3 = {
        data: [0.52, 1.561],
        options: {
            fill: ["#62cb31", "#edf0f5"]
        }
    };
    $scope.PieChart4 = {
        data: [1, 4],
        options: {
            fill: ["#62cb31", "#edf0f5"]
        }
    };
    $scope.PieChart5 = {
        data: [226, 134],
        options: {
            fill: ["#62cb31", "#edf0f5"]
        }
    };
    $scope.PieChart6 = {
        data: [0.52, 1.041],
        options: {
            fill: ["#62cb31", "#edf0f5"]
        }
    };

    $scope.BarChart = {
        data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
        options: {
            fill: ["#dbdbdb", "#62cb31"],
        }
    };

    $scope.LineChart = {
        data: [5, 9, 7, 3, 5, 2, 5, 3, 9, 6, 5, 9, 4, 7, 3, 2, 9, 8, 7, 4, 5, 1, 2, 9, 5, 4, 7],
        options: {
            fill: '#62cb31',
            stroke: '#62cb31',
            width: 64
        }
    };


    $scope.stanimation = 'bounceIn';
    $scope.runIt = true;
    $scope.runAnimation = function(){

        $scope.runIt = false;
        $timeout(function(){
            $scope.runIt = true;
        }, 100)

    };

}

/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 * Sweet Alert Directive
 * Official plugin - http://tristanedwards.me/sweetalert
 * Angular implementation inspiring by https://github.com/oitozero/ngSweetAlert
 */


function sweetAlert($timeout, $window) {
    var swal = $window.swal;
    return {
        swal: function (arg1, arg2, arg3) {
            $timeout(function () {
                if (typeof(arg2) === 'function') {
                    swal(arg1, function (isConfirm) {
                        $timeout(function () {
                            arg2(isConfirm);
                        });
                    }, arg3);
                } else {
                    swal(arg1, arg2, arg3);
                }
            }, 200);
        },
        success: function (title, message) {
            $timeout(function () {
                swal(title, message, 'success');
            }, 200);
        },
        error: function (title, message) {
            $timeout(function () {
                swal(title, message, 'error');
            }, 200);
        },
        warning: function (title, message) {
            $timeout(function () {
                swal(title, message, 'warning');
            }, 200);
        },
        info: function (title, message) {
            $timeout(function () {
                swal(title, message, 'info');
            }, 200);
        }

    };
};

/**
 * Pass function into module
 */
angular
    .module('homer')
    .factory('sweetAlert', sweetAlert)

/**
 *
 * alertsCtrl
 *
 */

angular
    .module('homer')
    .controller('alertsCtrl', alertsCtrl)

function alertsCtrl($scope, sweetAlert, notify) {

    $scope.demo1 = function () {
        sweetAlert.swal({
            title: "Welcome in Alerts",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        });
    }

    $scope.demo2 = function () {
        sweetAlert.swal({
            title: "Good job!",
            text: "You clicked the button!",
            type: "success"
        });
    }

    $scope.demo3 = function () {
        sweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!"
            },
            function () {
                sweetAlert.swal("Booyah!");
            });
    }

    $scope.demo4 = function () {
        sweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    sweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
                } else {
                    sweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
                }
            });
    }

    $scope.msg = 'Hello! This is a sample message!';
    $scope.demo = function () {
        notify({
            message: $scope.msg,
            classes: $scope.classes,
            templateUrl: $scope.template,
        });
    };
    $scope.closeAll = function () {
        notify.closeAll();
    };

    $scope.homerTemplate = 'views/notification/notify.html';
    $scope.homerDemo1 = function(){
        notify({ message: 'Info - This is a Homer info notification', classes: 'alert-info', templateUrl: $scope.homerTemplate});
    }
    $scope.homerDemo2 = function(){
        notify({ message: 'Success - This is a Homer success notification', classes: 'alert-success', templateUrl: $scope.homerTemplate});
    }
    $scope.homerDemo3 = function(){
        notify({ message: 'Warning - This is a Homer warning notification', classes: 'alert-warning', templateUrl: $scope.homerTemplate});
    }
    $scope.homerDemo4 = function(){
        notify({ message: 'Danger - This is a Homer danger notification', classes: 'alert-danger', templateUrl: $scope.homerTemplate});
    }

}
/**
 *
 * modalCtrl
 *
 */

angular
    .module('homer')
    .controller('modalCtrl', modalCtrl)

function modalCtrl($scope, $modal) {

    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'views/modal/modal_example.html',
            controller: ModalInstanceCtrl,
        });
    };

    $scope.open1 = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal/modal_example1.html',
            controller: ModalInstanceCtrl
        });
    };

    $scope.open3 = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal/modal_example3.html',
            size: size,
            controller: ModalInstanceCtrl,
        });
    };

    $scope.open2 = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal/modal_example2.html',
            controller: ModalInstanceCtrl,
            windowClass: "hmodal-info"
        });
    };

    $scope.open4 = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal/modal_example2.html',
            controller: ModalInstanceCtrl,
            windowClass: "hmodal-warning"
        });
    };

    $scope.open5 = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal/modal_example2.html',
            controller: ModalInstanceCtrl,
            windowClass: "hmodal-success"
        });
    };

    $scope.open6 = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal/modal_example2.html',
            controller: ModalInstanceCtrl,
            windowClass: "hmodal-danger"
        });
    };
};

function ModalInstanceCtrl ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
/**
 *
 * charts_flotCtrl
 *
 */

angular
    .module('homer')
    .controller('charts_flotCtrl', charts_flotCtrl)

function charts_flotCtrl($scope) {

    /**
     * Bar Chart Options
     */
    $scope.flotBarOptions = {
        series: {
            bars: {
                show: true,
                barWidth: 0.8,
                fill: true,
                fillColor: {
                    colors: [ { opacity: 0.6 }, { opacity: 0.6 } ]
                },
                lineWidth: 1
            }
        },
        xaxis: {
            tickDecimals: 0
        },
        colors: ["#62cb31"],
        grid: {
            color: "#e4e5e7",
            hoverable: true,
            clickable: true,
            tickColor: "#D4D4D4",
            borderWidth: 0,
            borderColor: 'e4e5e7',
        },
        legend: {
            show: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "x: %x, y: %y"
        }
    };

    /**
     * Bar Chart Options for Analytics
     */
    $scope.flotBarOptionsDas = {
        series: {
            bars: {
                show: true,
                barWidth: 0.8,
                fill: true,
                fillColor: {
                    colors: [ { opacity: 1 }, { opacity: 1 } ]
                },
                lineWidth: 1
            }
        },
        xaxis: {
            tickDecimals: 0
        },
        colors: ["#62cb31"],
        grid: {
            show: false
        },
        legend: {
            show: false
        }
    };

    /**
     * Bar Chart Options for Widget
     */
    $scope.flotBarOptionsWid = {
        series: {
            bars: {
                show: true,
                barWidth: 0.8,
                fill: true,
                fillColor: {
                    colors: [ { opacity: 1 }, { opacity: 1 } ]
                },
                lineWidth: 1
            }
        },
        xaxis: {
            tickDecimals: 0
        },
        colors: ["#3498db"],
        grid: {
            show: false
        },
        legend: {
            show: false
        }
    };

    /**
     * Bar Chart data
     */
    $scope.flotChartData = [
        {
            label: "bar",
            data: [ [1, 12], [2, 14], [3, 18], [4, 24], [5, 32], [6, 22] ]
        }
    ];

    /**
     * Line Chart Data
     */
    $scope.flotLineAreaData = [
        {
            label: "line",
            data: [ [1, 34], [2, 22], [3, 19], [4, 12], [5, 32], [6, 54], [7, 23], [8, 57], [9, 12], [10, 24], [11, 44], [12, 64], [13, 21] ]
        }
    ]

    var data1 = [ [0, 26], [1, 24], [2, 29], [3, 26], [4, 33], [5, 26], [6, 36], [7, 28] ];

    $scope.chartUsersData = [data1];
    $scope.chartUsersOptions = {
        series: {
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.5
            },
        },
        grid: {
            tickColor: "#e4e5e7",
            borderWidth: 1,
            borderColor: '#e4e5e7',
            color: '#6a6c6f'
        },
        colors: [ "#62cb31", "#efefef"],
    };

    /**
     * Pie Chart Data
     */
    $scope.pieChartData = [
        { label: "Data 1", data: 16, color: "#84c465", },
        { label: "Data 2", data: 6, color: "#8dd76a", },
        { label: "Data 3", data: 22, color: "#a2c98f", },
        { label: "Data 4", data: 32, color: "#c7eeb4", }
    ];

    $scope.pieChartDataDas = [
        { label: "Data 1", data: 16, color: "#62cb31", },
        { label: "Data 2", data: 6, color: "#A4E585", },
        { label: "Data 3", data: 22, color: "#368410", },
        { label: "Data 4", data: 32, color: "#8DE563", }
    ];

    $scope.pieChartDataWid = [
        { label: "Data 1", data: 16, color: "#fad57c", },
        { label: "Data 2", data: 6, color: "#fde5ad", },
        { label: "Data 3", data: 22, color: "#fcc43c", },
        { label: "Data 4", data: 32, color: "#ffb606", }
    ];

    /**
     * Pie Chart Options
     */
    $scope.pieChartOptions = {
        series: {
            pie: {
                show: true
            }
        },
        grid: {
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false
        }
    };

    $scope.lineChartData = [
        {
            label: "line",
            data: [ [1, 24], [2, 15], [3, 29], [4, 34], [5, 30], [6, 40], [7, 23], [8, 27], [9, 40] ]
        }
    ];

    /**
     * Line Chart Options
     */
    $scope.lineChartOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 1,
                fill: true,
                fillColor: {
                    colors: [ { opacity: 0.5 }, { opacity: 0.5 }
                    ]
                }
            }
        },
        xaxis: {
            tickDecimals: 0
        },
        colors: ["#62cb31"],
        grid: {
            tickColor: "#e4e5e7",
            borderWidth: 1,
            borderColor: '#e4e5e7',
            color: '#6a6c6f'
        },
        legend: {
            show: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "x: %x, y: %y"
        }
    };

    /**
     * Line Chart Options for Dashboard
     */
    $scope.lineChartOptionsDas = {
        series: {
            lines: {
                show: true,
                lineWidth: 1,
                fill: true,
                fillColor: {
                    colors: [ { opacity: 1 }, { opacity: 1}
                    ]
                }
            }
        },
        xaxis: {
            tickDecimals: 0
        },
        colors: ["#62cb31"],
        grid: {
            tickColor: "#e4e5e7",
            borderWidth: 1,
            borderColor: '#e4e5e7',
            color: '#6a6c6f'
        },
        legend: {
            show: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "x: %x, y: %y"
        }
    };

    /**
     * Sin cos Chart Options
     */

    var sin = [],
        cos = [];
    for (var i = 0; i < 14; i += 0.5) {
        sin.push([i, Math.sin(i)]);
        cos.push([i, Math.cos(i)]);
    }

    $scope.sinCosChartData =
        [
            { data: sin, label: "sin(x)"},
            { data: cos, label: "cos(x)"}
        ];
    $scope.sinCosChartOptions = {
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        grid: {
            tickColor: "#e4e5e7",
            borderWidth: 1,
            borderColor: '#e4e5e7',
            color: '#6a6c6f'
        },
        yaxis: {
            min: -1.2,
            max: 1.2
        },
        colors: [ "#62cb31", "#efefef"],
    }
}
/**
 *
 * chartjsCtrl
 *
 */

angular
    .module('homer')
    .controller('chartjsCtrl', chartjsCtrl)

function chartjsCtrl($scope) {

    /**
     * Data for Polar chart
     */
    $scope.polarData = [
        {
            value: 120,
            color:"#62cb31",
            highlight: "#57b32c",
            label: "Homer"
        },
        {
            value: 140,
            color: "#80dd55",
            highlight: "#57b32c",
            label: "Inspinia"
        },
        {
            value: 100,
            color: "#a3e186",
            highlight: "#57b32c",
            label: "Luna"
        }
    ];

    /**
     * Options for Polar chart
     */
    $scope.polarOptions = {
        scaleShowLabelBackdrop : true,
        scaleBackdropColor : "rgba(255,255,255,0.75)",
        scaleBeginAtZero : true,
        scaleBackdropPaddingY : 1,
        scaleBackdropPaddingX : 1,
        scaleShowLine : true,
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 1,
        animationSteps : 100,
        animationEasing : "easeOutBounce",
        animateRotate : true,
        animateScale : false,
    };

    /**
     * Data for Doughnut chart
     */
    $scope.doughnutData = [
        {
            value: 20,
            color:"#62cb31",
            highlight: "#57b32c",
            label: "App"
        },
        {
            value: 120,
            color: "#91dc6e",
            highlight: "#57b32c",
            label: "Software"
        },
        {
            value: 100,
            color: "#a3e186",
            highlight: "#57b32c",
            label: "Laptop"
        }
    ];

    /**
     * Options for Doughnut chart
     */
    $scope.doughnutOptions = {
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 1,
        percentageInnerCutout : 45, // This is 0 for Pie charts
        animationSteps : 100,
        animationEasing : "easeOutBounce",
        animateRotate : true,
        animateScale : false,
    };

    /**
     * Data for Line chart
     */
    $scope.lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [22, 44, 67, 43, 76, 45, 12]
            },
            {
                label: "Example dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.7)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: [16, 32, 18, 26, 42, 33, 44]
            }
        ]
    };

    /**
     * Options for Line chart
     */
    $scope.lineOptions = {
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : true,
        bezierCurveTension : 0.4,
        pointDot : true,
        pointDotRadius : 4,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 1,
        datasetFill : true,
    };

    /**
     * Data for Sharp Line chart
     */
    $scope.sharpLineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.7)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(98,203,49,1)",
                data: [33, 48, 40, 19, 54, 27, 54]
            }
        ]
    };

    /**
     * Options for Sharp Line chart
     */
    $scope.sharpLineOptions = {
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : false,
        pointDot : true,
        pointDotRadius : 4,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 1,
        datasetFill : true,
    };

    /**
     * Options for Bar chart
     */
    $scope.barOptions = {
        scaleBeginAtZero : true,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        barShowStroke : true,
        barStrokeWidth : 1,
        barValueSpacing : 5,
        barDatasetSpacing : 1,
    };

    /**
     * Data for Bar chart
     */
    $scope.barData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.8)",
                highlightFill: "rgba(98,203,49,0.75)",
                highlightStroke: "rgba(98,203,49,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    /**
     * Options for Single Bar chart
     */
    $scope.singleBarOptions = {
        scaleBeginAtZero : true,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        barShowStroke : true,
        barStrokeWidth : 1,
        barValueSpacing : 5,
        barDatasetSpacing : 1,
    };

    /**
     * Data for Single Bar chart
     */
    $scope.singleBarData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My Second dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.8)",
                highlightFill: "rgba(98,203,49,0.75)",
                highlightStroke: "rgba(98,203,49,1)",
                data: [10, 20, 30, 40, 30, 50, 60]
            }
        ]
    };

    /**
     * Data for Radar chart
     */
    $scope.radarData = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(98,203,49,0.2)",
                strokeColor: "rgba(98,203,49,1)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#62cb31",
                data: [65, 59, 66, 45, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(98,203,49,0.4)",
                strokeColor: "rgba(98,203,49,1)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#62cb31",
                data: [28, 12, 40, 19, 63, 27, 87]
            }
        ]
    };

    /**
     * Options for Radar chart
     */
    $scope.radarOptions = {
        scaleShowLine : true,
        angleShowLineOut : true,
        scaleShowLabels : false,
        scaleBeginAtZero : true,
        angleLineColor : "rgba(0,0,0,.1)",
        angleLineWidth : 1,
        pointLabelFontFamily : "'Arial'",
        pointLabelFontStyle : "normal",
        pointLabelFontSize : 10,
        pointLabelFontColor : "#666",
        pointDot : true,
        pointDotRadius : 2,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 1,
        datasetFill : true,
    };

    /**
     * Data for Line chart
     */
    $scope.lineProjectData = {
        labels: ["January", "February", "March", "April"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(98,203,49,0.5)",
                strokeColor: "rgba(98,203,49,0.7)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: [17,21,19,24]
            }
        ]
    };

    /**
     * Options for Line chart
     */
    $scope.lineProjectOptions = {
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : false,
        pointDot : true,
        pointDotRadius : 3,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : false,
        datasetStrokeWidth : 1,
        datasetFill : true,
        responsive: true,
        tooltipTemplate: "<%= value %>",
        showTooltips: true,
        onAnimationComplete: function()
        {
            this.showTooltip(this.datasets[0].points, true);
        },
        tooltipEvents: []
    };
}
/**
 *
 * inlineChartsCtrl
 *
 */

angular
    .module('homer')
    .controller('inlineChartsCtrl', inlineChartsCtrl)

function inlineChartsCtrl($scope) {

    /**
     * Inline chart
     */
    $scope.inlineData = [34, 43, 43, 35, 44, 32, 44, 52, 25];
    $scope.inlineOptions = {
        type: 'line',
        lineColor: '#54ab2c',
        fillColor: '#62cb31',
    };

    /**
     * Bar chart
     */
    $scope.barSmallData = [5, 6, 7, 2, 0, -4, -2, 4];
    $scope.barSmallOptions = {
        type: 'bar',
        barColor: '#62cb31',
        negBarColor: '#c6c6c6'
    };

    /**
     * Pie chart
     */
    $scope.smallPieData = [1, 1, 2];
    $scope.smallPieOptions = {
        type: 'pie',
        sliceColors: ['#62cb31', '#b3b3b3', '#e4f0fb']
    };

    /**
     * Long line chart
     */
    $scope.longLineData = [34, 43, 43, 35, 44, 32, 15, 22, 46, 33, 86, 54, 73, 53, 12, 53, 23, 65, 23, 63, 53, 42, 34, 56, 76, 15, 54, 23, 44];
    $scope.longLineOptions = {
        type: 'line',
        lineColor: '#62cb31',
        fillColor: '#ffffff'
    };

    /**
     * Tristate chart
     */
    $scope.tristateData = [1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, 1];
    $scope.tristateOptions = {
        type: 'tristate',
        posBarColor: '#62cb31',
        negBarColor: '#bfbfbf'
    };

    /**
     * Discrate chart
     */
    $scope.discreteData = [4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 5, 6, 3, 4, 5, 8, 7, 6, 9, 3, 2, 4, 1, 5, 6, 4, 3, 7, ];
    $scope.discreteOptions = {
        type: 'discrete',
        lineColor: '#62cb31'
    };

    /**
     * Pie chart
     */
    $scope.pieCustomData = [52, 12, 44];
    $scope.pieCustomOptions = {
        type: 'pie',
        height: '150px',
        sliceColors: ['#1ab394', '#b3b3b3', '#e4f0fb']
    };

    /**
     * Bar chart
     */
    $scope.barCustomData = [5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 14, 4, 2, 14, 12, 7];
    $scope.barCustomOptions = {
        type: 'bar',
        barWidth: 8,
        height: '150px',
        barColor: '#1ab394',
        negBarColor: '#c6c6c6'
    };

    /**
     * Line chart
     */
    $scope.lineCustomData = [34, 43, 43, 35, 44, 32, 15, 22, 46, 33, 86, 54, 73, 53, 12, 53, 23, 65, 23, 63, 53, 42, 34, 56, 76, 15, 54, 23, 44];
    $scope.lineCustomOptions = {
        type: 'line',
        lineWidth: 1,
        height: '150px',
        lineColor: '#17997f',
        fillColor: '#ffffff',
    };
}
/**
 *
 * clockCtrl
 *
 */

angular
    .module('homer')
    .controller('clockCtrl', clockCtrl)

function clockCtrl($scope, $timeout) {
    $scope.tickInterval = 1000 //ms

    var tick = function() {
        $scope.clock = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);
}
/**
 *
 * timelineCtrl
 *
 */

angular
    .module('homer')
    .controller('timelineCtrl', timelineCtrl)

function timelineCtrl($scope) {


    $scope.timelineItems = [
        {
            type: "The standard chunk of Lorem Ipsum",
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to ",
            date: 1423063721,
            info: "It is a long established fact that"
        },
        {
            type: "There are many variations",
            content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here",
            date: 1423063721,
            info: "It is a long established fact that"
        },
        {
            type: "Contrary to popular belief",
            content: " If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
            date: 1423063721,
            info: "It is a long established fact that"
        },
        {
            type: "Lorem Ipsum",
            content: "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words.",
            date: 1423063721,
            info: "It is a long established fact that"
        },
        {
            type: "The generated Lorem Ipsum",
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to ",
            date: 1423063721,
            info: "It is a long established fact that"
        },
        {
            type: "The standard chunk",
            content: "Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
            date: 1423063721,
            info: "It is a long established fact that"
        }
    ];

}
/**
 *
 * googleMapCtrl
 *
 */

angular
    .module('homer')
    .controller('googleMapCtrl', googleMapCtrl)

function googleMapCtrl($scope, $timeout) {
    $scope.mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(40.6700, -73.9400),
        // Style for Google Maps
        styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
}
/**
 *
 * calendarCtrl
 *
 */

angular
    .module('homer')
    .controller('calendarCtrl', calendarCtrl)

function calendarCtrl($scope) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.alertMessage = "Report all events from UI calendar.";

    // Events
    $scope.events = [
        {title: 'All Day Event',start: new Date(y, m, 1)},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        {title: 'Homer task',start: new Date(y, m, d + 5, 19, 0),end: new Date(y, m, d + 6, 22, 30),allDay: false, backgroundColor :"#62cb31", borderColor :"#62cb31"},
        {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];


    /* message on eventClick */
    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
        $scope.alertMessage = (event.title + ': Clicked ');
    };
    /* message on Drop */
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        $scope.alertMessage = (event.title +': Droped to make dayDelta ' + dayDelta);
    };
    /* message on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
        $scope.alertMessage = (event.title +': Resized to make dayDelta ' + minuteDelta);
    };

    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 550,
            editable: true,
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        }
    };

    /* Event sources array */
    $scope.eventSources = [$scope.events];

}
/**
 *
 * editorCtrl
 *
 */

angular
    .module('homer')
    .controller('editorCtrl', editorCtrl)

function editorCtrl($scope) {

    $scope.summernoteText = ['<h3>Hello Jonathan! </h3>',
        '<p>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the dustrys</strong> standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more',
        '<br/><br/>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.',
        'recently with.</p><p>Mark Smith</p>'].join('');

    $scope.summernoteTextTwo = ['<h4>It is a long established fact</h4>',
        '<p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)',
        '<p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)',
        'with.</p>'].join('');

    $scope.summernoteOpt = {
        toolbar: [
            ['headline', ['style']],
            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
            ['textsize', ['fontsize']],
            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
        ]
    };

}
/**
 *
 * nggridCtrl
 *
 */

angular
    .module('homer')
    .controller('nggridCtrl', nggridCtrl)

function nggridCtrl($scope) {

    $scope.exampleData = [ { "Name": "Jakeem", "Email": "imperdiet@vulputatevelit.com", "Company": "Laoreet Lectus Corporation", "City": "Vaux-sur-Sure", "Country": "Papua New Guinea" }, { "Name": "Kadeem", "Email": "sit.amet.risus@scelerisquenequesed.net", "Company": "Mi Felis Adipiscing Institute", "City": "Fauglia", "Country": "Bouvet Island" }, { "Name": "Paula", "Email": "venenatis.lacus@milorem.net", "Company": "Libero LLP", "City": "Tirupati", "Country": "Antigua and Barbuda" }, { "Name": "Bree", "Email": "adipiscing.non.luctus@loremutaliquam.edu", "Company": "Vitae Purus Gravida Institute", "City": "Chatteris", "Country": "Poland" }, { "Name": "Quinn", "Email": "Nunc@ac.com", "Company": "Dui Lectus Rutrum Consulting", "City": "Wolverhampton", "Country": "Venezuela" }, { "Name": "Magee", "Email": "pretium.aliquet.metus@venenatislacus.co.uk", "Company": "Dui Associates", "City": "Stokrooie", "Country": "Japan" }, { "Name": "Rowan", "Email": "mus@rutrum.net", "Company": "Diam Pellentesque Habitant Institute", "City": "Ashburton", "Country": "Taiwan" }, { "Name": "Nina", "Email": "lobortis.augue@feugiatnec.org", "Company": "Auctor Velit Eget Consulting", "City": "Stevenage", "Country": "Denmark" }, { "Name": "Chava", "Email": "nec@ipsumSuspendissesagittis.com", "Company": "Egestas Company", "City": "Aulnay-sous-Bois", "Country": "Togo" }, { "Name": "Uma", "Email": "tincidunt.nunc@vestibulumneque.net", "Company": "Sem Semper Corp.", "City": "Dalkeith", "Country": "Nigeria" }, { "Name": "Amal", "Email": "laoreet.posuere@eu.net", "Company": "Non Massa PC", "City": "Stafford", "Country": "South Sudan" }, { "Name": "Dana", "Email": "Nulla.dignissim@mattisornarelectus.co.uk", "Company": "Laoreet PC", "City": "Gentinnes", "Country": "Korea, South" }, { "Name": "Iris", "Email": "nostra.per.inceptos@magnamalesuada.co.uk", "Company": "Diam Vel LLC", "City": "Oudekapelle", "Country": "Dominican Republic" }, { "Name": "Joshua", "Email": "Duis@enimgravidasit.com", "Company": "Magna Foundation", "City": "San Francisco", "Country": "Guinea-Bissau" }, { "Name": "Rosalyn", "Email": "egestas.ligula.Nullam@auctorullamcorpernisl.ca", "Company": "Sodales Mauris LLC", "City": "Seydişehir", "Country": "Sudan" }, { "Name": "Hilary", "Email": "et.pede.Nunc@accumsanneque.co.uk", "Company": "Et Rutrum Corp.", "City": "Broechem", "Country": "Bulgaria" }, { "Name": "Amena", "Email": "nisl.Maecenas.malesuada@vitaeorci.edu", "Company": "Quis LLC", "City": "Joliet", "Country": "Saint Lucia" }, { "Name": "Rashad", "Email": "Pellentesque.tincidunt@euneque.org", "Company": "Suspendisse Tristique Neque Industries", "City": "Amlwch", "Country": "Timor-Leste" }, { "Name": "Sharon", "Email": "ornare.sagittis@vitaeeratvel.ca", "Company": "Tellus Foundation", "City": "Woodstock", "Country": "Chile" } ];

    $scope.gridOptions = {
        data: 'exampleData'
    };
//
    $scope.gridOptionsTwo = {
        data: 'exampleData',
        showGroupPanel: true,
        jqueryUIDraggable: true
    }
}
/**
 *
 * nestableCtrl
 *
 */

angular
    .module('homer')
    .controller('nestableCtrl', nestableCtrl)

function nestableCtrl($scope) {

    // Handle actions
    $scope.remove = function(scope) {
        scope.remove();
    };
    $scope.toggle = function(scope) {
        scope.toggle();
    };
    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0,0, a);
    };
    $scope.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
        });
    };
    $scope.collapseAll = function() {
        $scope.$broadcast('collapseAll');
    };
    $scope.expandAll = function() {
        $scope.$broadcast('expandAll');
    };

    // Nestable list example data
    $scope.data = [{
        "id": 1,
        "title": "Sem fringilla",
        "nodes": [
            {
                "id": 11,
                "title": "Nisl lacus et, ultricies",
                "nodes": [
                    {
                        "id": 111,
                        "title": "Congue hac",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 12,
                "title": "Consectetuer orci mollis",
                "nodes": []
            }
        ],
    }, {
        "id": 2,
        "title": "Gravida morbi non",
        "nodes": [
            {
                "id": 21,
                "title": "Lorem aliquam",
                "nodes": []
            },
            {
                "id": 22,
                "title": "Inceptos nibh",
                "nodes": []
            }
        ],
    }, {
        "id": 3,
        "title": "Pede hymenaeos",
        "nodes": [
            {
                "id": 31,
                "title": "Magnis morbi orci",
                "nodes": []
            },
            {
                "id": 32,
                "title": "Ad tortor, auctor dui",
                "nodes": []
            },
            {
                "id": 33,
                "title": "Orci magnis, mauris",
                "nodes": []
            }
        ],
    }];
}
/**
 *
 * tourCtrl
 *
 */

angular
    .module('homer')
    .controller('tourCtrl', tourCtrl)

function tourCtrl($scope) {





}
/**
 *
 * datatablesCtrl
 *
 */

angular
    .module('homer')
    .controller('datatablesCtrl', datatablesCtrl)

function datatablesCtrl($scope, DTOptionsBuilder, DTColumnBuilder) {

    // See all possibility of fetch data with example code at:
    // http://l-lin.github.io/angular-datatables/#/withAjax

    // Please note that api file is not included to grunt build process
    // As it will be probably replacement to some REST service we only add it for demo purpose

    $scope.dtOptions = DTOptionsBuilder.fromSource('api/datatables.json');
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Name').withTitle('Name'),
        DTColumnBuilder.newColumn('Position').withTitle('Position'),
        DTColumnBuilder.newColumn('Office').withTitle('Office'),
        DTColumnBuilder.newColumn('Age').withTitle('Age'),
        DTColumnBuilder.newColumn('Start_date').withTitle('Start_date'),
        DTColumnBuilder.newColumn('Salary').withTitle('Salary')
    ];
}
/**
 *
 * wizardCtrl
 *
 */

angular
    .module('homer')
    .controller('wizardOneCtrl', wizardOneCtrl)

function wizardOneCtrl($scope, notify, sweetAlert) {

    // Initial user
    $scope.user = {
        username: 'Mark Smith',
        email: 'mark@company.com',
        password: 'secret_password',
        approve: false
    }

    // Initial step
    $scope.step = 1;

    // Wizard functions
    $scope.wizard =  {
        show: function(number) {
            $scope.step = number;
        },
        next: function() {
            $scope.step++ ;
        },
        prev: function() {
            $scope.step-- ;
        }
    };

    $scope.submit = function()
    {
        // Show notification
        sweetAlert.swal({
            title: "Thank you!",
            text: "You approved our example form!",
            type: "success"
        });

        // 'Redirect' to step 1
        $scope.step = 1;

    }

}


/**
 *
 * formsCtrl
 *
 */

angular
    .module('homer')
    .controller('formsCtrl', formsCtrl)
    .controller('SelectLocalCtrl', SelectLocalCtrl)
    .controller('RadiolistCtrl', RadiolistCtrl)
    .controller('Html5InputsCtrl', Html5InputsCtrl)
    .controller('DatepickerDemoCtrl', DatepickerDemoCtrl)
    .controller('spinCtrl', spinCtrl)

function formsCtrl($scope) {

    $scope.user = {
        name: 'awesome user',
        desc: 'Awesome user \ndescription!',
        remember: true
    };


    $scope.person = {};
    $scope.people = [
        { name: 'Adam',      email: 'adam@email.com',      age: 10 },
        { name: 'Amalie',    email: 'amalie@email.com',    age: 12 },
        { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30 },
        { name: 'Samantha',  email: 'samantha@email.com',  age: 31 },
        { name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
        { name: 'Natasha',   email: 'natasha@email.com',   age: 54 },
        { name: 'Nicole',    email: 'nicole@email.com',    age: 43 },
        { name: 'Adrian',    email: 'adrian@email.com',    age: 21 }
    ];

    $scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];
    $scope.multipleDemo = {};
    $scope.multipleDemo.colors = ['Blue','Red'];

    $scope.availableTags = ['Branding','Website','Design','Ilustration','New','Important','External'];
    $scope.multipleTags = {};
    $scope.multipleTags.tags = ['Branding','Website','Design','Ilustration','New'];

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
}

function SelectLocalCtrl($scope, $filter) {
    $scope.user = {
        status: 2
    };

    $scope.statuses = [
        {value: 1, text: 'status1'},
        {value: 2, text: 'status2'},
        {value: 3, text: 'status3'},
        {value: 4, text: 'status4'}
    ];

    $scope.showStatus = function() {
        var selected = $filter('filter')($scope.statuses, {value: $scope.user.status});
        return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
    };
}

function RadiolistCtrl($scope, $filter){
    $scope.user = {
        status: 2
    };

    $scope.statuses = [
        {value: 1, text: 'status1'},
        {value: 2, text: 'status2'}
    ];

    $scope.showStatus = function() {
        var selected = $filter('filter')($scope.statuses, {value: $scope.user.status});
        return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
    };
}

function Html5InputsCtrl($scope) {
    $scope.user = {
        email: 'email@example.com',
        tel: '123-45-67',
        number: 29,
        range: 10,
        url: 'http://example.com',
        search: 'blabla',
        color: '#6a4415',
        date: null,
        time: '12:30',
        datetime: null,
        month: null,
        week: null
    };
}

function DatepickerDemoCtrl($scope) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
}

function spinCtrl($scope){

    $scope.inputteresxcs = 55;
    $scope.spinOption1 = {
        min: 0,
        max: 100,
        step: 0.1,
        decimals: 2,
        boostat: 5,
        maxboostedstep: 10,
    };

    $scope.spinOption2 = {
        verticalbuttons: true
    }

    $scope.spinOption3 = {
        postfix: '%'
    }

    $scope.spinOption4 = {
        postfix: "a button",
        postfix_extraclass: "btn btn-default"
    }

}
/**
 *
 * draggableCtrl
 *
 */

angular
    .module('homer')
    .controller('draggableCtrl', draggableCtrl)

function draggableCtrl($scope) {

    $scope.sortableOptions = {
        connectWith: ".connectPanels",
        handler: ".panel-body"
    };

}
/**
 *
 * validationCtrl
 *
 */

angular
    .module('homer')
    .controller('validationCtrl', validationCtrl)

function validationCtrl($scope) {

    $scope.signupForm = function() {

        if ($scope.signup_form.$valid) {
            // Submit as normal
        } else {
            $scope.signup_form.submitted = true;
        }
    }

}

/**
 *
 * alertsCtrl
 *
 */

angular
    .module('homer')
    .controller('signupCtrl', signupCtrl)

function signupCtrl($scope, $rootScope, api) {

    $scope.signup = function($event){
        $event.preventDefault();
        api.signup($scope.form.data).then(function(response){
            localStorage.setItem("session", JSON.stringify(response.data));
            $rootScope.user = response.user;
            $rootScope.$state.go('dashboard');

            var empresa = {
                nombreempresa : $scope.form.data.nombreempresa,
                direccion : $scope.form.data.direccion,
                telefono : $scope.form.data.telefono,
                nit : $scope.form.data.nit,
                users : [response.data.id]
            }

            api.empresa().post(empresa).then(function(response){

            }).catch((function(e){
                console.log("Error creando la empresa");
            }));

        }).catch(function(e){
            console.log("Error creando la empresa");
        });
    }
}
/**
 *
 * alertsCtrl
 *
 */

angular
    .module('homer')
    .controller('loginCtrl', loginCtrl)

function loginCtrl($scope, $rootScope, api, $timeout, sweetAlert) {

    $scope.login = function($event){
        $event.preventDefault();
        
        api.login($scope.form.data).then(function(response){
            localStorage.setItem("session", JSON.stringify(response.data));
            $rootScope.user = response.data.user;
            
            return $rootScope.$state.go('campaings', { campaing : $rootScope.user.campaing_id});
        }).catch(function(e){
                if(e.data.statusCode == 400){
                    return sweetAlert.swal("Login Error", "Usuario/contraseña incorrectos", "error"); 
                }
        });
    }

}
/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('campaingCtrl', campaingCtrl)

function campaingCtrl($scope, $rootScope, api, menu, $modal, $stateParams, $timeout) {
    $scope.campaings = [];
    
    $scope.load = function(){
        api.campaings().get().then(function(response){
            $scope.campaings = response.data;
        }).catch(function(e){
            console.log(e.message);
        });     
    }
    
    $scope.new_campaing = function(){
        $scope.modal = $modal.open({
            templateUrl: 'views/campaings/new_campaing.html',
            controller: 'campaingCtrl',
        });
    }

    $scope.save = function(){
        if($scope.formCampaing.$valid){
            api.campaings().post($scope.form.data).then(function(response){
                $scope.campaing = response.data;
                $scope.campaings.data.push( response.data);
                $scope.$close();

            }).catch(function(e){
                console.log(e.message);
            });
        }
        console.log("form.data", $scope.form);
    }

}
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
/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('managersCtrl', managersCtrl)

function managersCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
    $scope.users= [];
    $scope.role = $stateParams.role;
    $rootScope.campaing = $stateParams.campaing;
    $scope.modal = null;

    menu.showMenu();

    $scope.load = function(){
        $rootScope.loading = true;

        api.managers().get().then(function(response){
            $scope.users = response.data.data;
            $rootScope.loading = false;
        }).catch(function(e){
            console.log(e.message);
            $rootScope.loading = false;
        });
    }
    
    $scope.new_manager = function(){
        var modal = $modal.open({
            templateUrl: 'views/admins/new_admin.html',
            controller: 'managersCtrl',
        });
    }

    $scope.edit_manager = function(){
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
            api.managers($scope.formEdit.id).put($scope.formEdit).then(function(response){
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
            api.managers().post($scope.form.data).then(function(response){
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
        api.managers($scope.selectedUser.id).delete().then(function(response){
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
/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('leadersCtrl', leadersCtrl)

function leadersCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
    $scope.users= [];
    $scope.role = $stateParams.role;
    $rootScope.campaing = $stateParams.campaing;
    $scope.modal = null;

    menu.showMenu();

    $scope.load = function(){
        $rootScope.loading = true;

        api.leaders().get().then(function(response){
            $scope.users = response.data.data;
            $rootScope.loading = false;
        }).catch(function(e){
            console.log(e.message);
            $rootScope.loading = false;
        });
    }
    
    $scope.new_leader = function(){
        var modal = $modal.open({
            templateUrl: 'views/leaders/new_leader.html',
            controller: 'leadersCtrl',
        });
    }

    $scope.edit_leader = function(){
        $scope.formEdit = angular.copy(this.user);

        $scope.modal = $modal.open({
            templateUrl: 'views/leaders/edit_leader.html',
            scope : $scope
        });
    }

    $scope.update = function(){
        if($scope.formEditUser.$valid){
            $rootScope.loading = true;
            $scope.modal.close();
            api.leaders($scope.formEdit.id).put($scope.formEdit).then(function(response){
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

            api.leaders().post($scope.form.data).then(function(response){
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
        api.leaders($scope.selectedUser.id).delete().then(function(response){
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
            }

            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
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

        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            $scope.getDocuments($scope.filter.periodo);

            api.saldosIngresos().add('saldos/consolidado/').add("periodo/" + $scope.filter.periodo).get().then(function(response){
                $rootScope.saldoIngresos = response.data;
            }).catch(function(e){
                $scope.loading = false;
            });

        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.categoria().get().then(function(response){
            $scope.categorias = response.data;
        }).catch(function(e){
            $rootScope.loading = false;
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
            $scope.loading = false;
        });


        api.formasPagos().get().then(function(response){
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

            obj.categoriadto = $rootScope.formEdit.categoriadto._id;
            obj.estadodocumento = $rootScope.formEdit.estadodocumento._id;
            obj.movimiento = $rootScope.formEdit.movimiento;
            obj.periodo = $rootScope.formEdit.periodo._id;
            obj.tercero = $rootScope.formEdit.tercero._id;
            obj.referencia = $rootScope.formEdit.referencia;
            obj.recordar = $rootScope.formEdit.recordar;
            obj.recordia = $rootScope.formEdit.recordia;
            obj.observacion = $rootScope.formEdit.observacion;
           
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
                $scope.getDocuments();
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
                $scope.getDocuments();
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
            $scope.descuentos = response.data;
        }).catch(function(e){
            $scope.loading = false;
        });


        api.formasPagos().get().then(function(response){
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
                $rootScope.$emit("reload_saldos");
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
/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('subcategoriasCtrl', subcategoriasCtrl)

function subcategoriasCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
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
         templateUrl: 'views/subcategorias/new_record.html',
         controller : 'subcategoriasCtrl'
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
     api.sub_categoria().get().then(function(response){
         $rootScope.subcategorias = response.data;
         $rootScope.loading = false;
     }).catch(function(e){
         $rootScope.loading = false;
     });

     api.categoria_padre().get().then(function(response){
        $scope.categorias_padre = response.data;
        $rootScope.loading = false;
    }).catch(function(e){
        $rootScope.loading = false;
    });

    api.categoria().get().then(function(response){
        $scope.categorias = response.data;
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
         templateUrl: 'views/subcategorias/edit_record.html',
         controller : 'subcategoriasCtrl'
     });
 }

 $scope.update = function(){
     if($scope.formRecordEdit.$valid){
         $rootScope.loading = true;
         $rootScope.formEdit.estado = $rootScope.formEdit.estado == "Habilitado" ? true : false;
         api.sub_categoria($rootScope.formEdit.id).put($rootScope.formEdit).then(function(response){
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

         api.sub_categoria().post($scope.form.data).then(function(response){
             $scope.load();
             $rootScope.loading = false;
             $scope.homerTemplate = 'views/notification/notify.html';
             delete $scope.form.data;
             notify({ message: 'Registro de subcategoria creado.', classes: 'alert-success', templateUrl: $scope.homerTemplate});
         }).catch(function(e){
             console.log(e.message);
         });
     }
 }


 $scope.detail = function(){
    $rootScope.$state.go('campaings.detail_periodo', { id: this.record.id});
 }

 $scope.remove  = function(id){
     api.sub_categoria(id).delete().then(function(response){
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
/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('categorias_documentosCtrl', categorias_documentosCtrl)

function categorias_documentosCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
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
         templateUrl: 'views/categorias_documentos/new_record.html',
         controller : 'categorias_documentosCtrl'
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
     api.categoria().get().then(function(response){
         $rootScope.categorias_documentos = response.data;
         $rootScope.loading = false;
     }).catch(function(e){
         $rootScope.loading = false;
     });

     api.sub_categoria().get().then(function(response){
        $rootScope.sub_categoria = response.data;
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
         templateUrl: 'views/categorias_documentos/edit_record.html',
         controller : 'categorias_documentosCtrl'
     });
 }

 $scope.update = function(){
     if($scope.formRecordEdit.$valid){
         $rootScope.loading = true;
         $rootScope.formEdit.estado = $rootScope.formEdit.estado == "Habilitado" ? true : false;
         api.categoria($rootScope.formEdit.id).put($rootScope.formEdit).then(function(response){
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

         api.categoria().post($scope.form.data).then(function(response){
             $scope.load();
             $rootScope.loading = false;
             $scope.homerTemplate = 'views/notification/notify.html';
             delete $scope.form.data;
             notify({ message: 'Registro creado con exito.', classes: 'alert-success', templateUrl: $scope.homerTemplate});
         }).catch(function(e){
             console.log(e.message);
         });
     }
 }


 $scope.detail = function(){
    $rootScope.$state.go('campaings.detail_periodo', { id: this.record.id});
 }

 $scope.remove  = function(id){
     api.categoria(id).delete().then(function(response){
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
/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('formas_pagosCtrl', formas_pagosCtrl)

function formas_pagosCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
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
        backdrop: 'static',
         templateUrl: 'views/formas_pagos/new_record.html',
         controller : 'formas_pagosCtrl'
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
     api.formasPagos().get().then(function(response){
         $rootScope.formas_pagos = response.data;
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
         backdrop: 'static',
         templateUrl: 'views/formas_pagos/edit_record.html',
         controller : 'formas_pagosCtrl'
     });
 }

 $scope.update = function(){
     if($scope.formRecordEdit.$valid){
         $rootScope.loading = true;
         $rootScope.formEdit.estado = $rootScope.formEdit.estado == "Habilitado" ? true : false;
         api.formasPagos($rootScope.formEdit.id).put($rootScope.formEdit).then(function(response){
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

         api.formasPagos().post($scope.form.data).then(function(response){
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
     api.formasPagos(id).delete().then(function(response){
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

    api.categoria().get().then(function(response){
        $scope.categorias = response.data;
        $rootScope.loading = false;
    }).catch(function(e){
        $rootScope.loading = false;
    });

    api.terceros().get().then(function(response){
        $scope.terceros = response.data;
        $rootScope.loading = false;
    }).catch(function(e){
        $rootScope.loading = false;
    });

    $scope.openModalFilter = function(){
        var modal = $modal.open({
            templateUrl: 'views/reportes/filter.html',
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

    $scope.query = function(){
        var filter = "?";
        $scope.loading = true;

        if($scope.form.data.categoria){
            filter += "categoriadto="+$scope.form.data.categoria+"&";
        }

        if($scope.form.data.tercero){
            filter += "tercero="+$scope.form.data.tercero.id+"&";
        }

        filter += "estadodocumento.descripcion=Finalizado&";

        api.egresos().add(filter).get().then(function(res){
           $scope.records = res.data || [];
           $scope.loading = false;

           if($scope.records.length > 0){
                var output = _($scope.records).groupBy('tercero.nombre').map(function(egresos, key){
                    var sumMes = function(data, mes){
                        var total = 0;

                        var rs = data.filter(function(e){

                            if(e.fechaFinalizado &&  (moment(e.fechaFinalizado).month() == mes)){
                                return true
                            }

                            return false;
                        });

                        for (var index = 0; index < rs.length; index++) {
                            var element = rs[index];
                            console.log("elemnt", element);
                            if(element.movimiento.length > 0){
                                for (var i = 0;  i < element.movimiento.length; i++) {
                                    var m = element.movimiento[i];
                                        console.log("m", m);
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

        if($stateParams.id){
            $scope.recordId = $stateParams.id;

            api.egresos($stateParams.id).get().then(function(response){
                $scope.recordDetail = response.data;
                $rootScope.loading = false;
            }).catch(function(e){
                $rootScope.loading = false;
            });
        }

        api.egresos().get().then(function(response){
            $rootScope.egresos = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            console.log(response);
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.categoria().get().then(function(response){
            $scope.categorias = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.terceros().get().then(function(response){
            $scope.terceros = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

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

        api.periodo().get().then(function(response){
            $rootScope.periodos = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.categoria().get().then(function(response){
            $scope.categorias = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

        api.terceros().get().then(function(response){
            $scope.terceros = response.data;
            $rootScope.loading = false;
        }).catch(function(e){
            $rootScope.loading = false;
        });

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
/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('dashboardCtrl', dashboardCtrl)

function dashboardCtrl($scope, $rootScope, api, menu, $modal, $stateParams, $timeout) {
    $scope.filter = {};

    $rootScope.$on("reload_saldos", function(){
        api.formasPagos().add('saldos').get().then(function(response){
            $scope.consolidado = response.data;
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });
    });
    
    $scope.load = function(){
       api.formasPagos().add('saldos').get().then(function(response){
            $scope.consolidado = response.data;
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });

        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.filter.periodo = $scope.selectedPeriodo.id;

            api.saldosIngresos().add('saldos/consolidado/').add("periodo/" + $scope.filter.periodo).get().then(function(response){
                $rootScope.saldoIngresos = response.data;
            }).catch(function(e){
                $scope.loading = false;
            });

            api.saldosEgresos().add('saldos/consolidado/').add("periodo/" + $scope.filter.periodo).get().then(function(response){
                $rootScope.saldoEgresos = response.data;
            }).catch(function(e){
                $scope.loading = false;
            });

        }).catch(function(e){
            $rootScope.loading = false;
        });

        
        $scope.toNegative = function(value){
            return Math.abs(value) * -1;
        }
    }
}
/**
 *
 * campaingCtrl
 *
 */

angular
    .module('homer')
    .controller('navigationCtrl', navigationCtrl)

function navigationCtrl($scope, $rootScope, api, menu, $modal, $stateParams, $timeout) {
    $scope.filter = {};

    $rootScope.$on("reload_saldos", function(){
        $scope.load();
    });

    $scope.getDocuments = function(id){
        api.ingresos().add("periodo/" + (id ? id : "")).get().then(function(response){
            $rootScope.ingresos = response.data;
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });  
     }

    $scope.load = function(){
        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            api.saldosIngresos().add('saldos/consolidado/').add("periodo/" + $scope.filter.periodo).get().then(function(response){
                $rootScope.saldoIngresos = response.data;
            }).catch(function(e){
                $scope.loading = false;
            });

        }).catch(function(e){
            $rootScope.loading = false;
        });
    }
}
/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('profileCtrl', profileCtrl)

function profileCtrl($scope, $rootScope, api, menu, $modal, $stateParams, $timeout) {
    $scope.filter = {};

    $rootScope.$on("reload_saldos", function(){

    });

    $scope.getDocuments = function(id){
        api.ingresos().add("periodo/" + (id ? id : "")).get().then(function(response){
            
            if(response  && response.data.length > 0){
                $scope.ingresos = response.data;
            }

            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });  
     }

    $scope.getEgresos = function(){
        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            console.log("selectedPeriodo", $scope.selectedPeriodo);

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            $scope.getByPeriodo($scope.filter.periodo);

        }).catch(function(e){
            $rootScope.loading = false;
        });
    }

    $scope.getIngresos = function(){
        api.periodo().get().then(function(response){
            $scope.periodos = response.data;
            
            $scope.selectedPeriodo = response.data.filter(function(p){
                return moment(p.finicial).isSame(moment(new Date()), 'month');
            })[0];

            $scope.filter.periodo = $scope.selectedPeriodo.id;
            $scope.getDocuments($scope.filter.periodo);
            
        }).catch(function(e){
            $rootScope.loading = false;
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

    $scope.getByPeriodo = function(id){
        $scope.getEgresos(id);
    }

    $scope.getEgresos = function(id){
        $scope.loading = true;

        api.egresos().add("/periodo/" + (id ? id : "")).get().then(function(response){
            if(response  && response.data.length > 0){
                $scope.egresos = response.data;
            }
            
            $scope.loading = false;
        }).catch(function(e){
            $scope.loading = false;
        });  
     }
}
/**
 *
 * campaingCtrl
 *
 */

 angular
 .module('homer')
 .controller('tercerosCtrl', tercerosCtrl)

function tercerosCtrl($scope, $rootScope, api, menu, $modal, $stateParams, notify, sweetAlert) {
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
        backdrop: 'static',
        templateUrl: 'views/terceros/new_record.html'
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

         api.terceros($stateParams.id).get().then(function(response){
             $scope.recordDetail = response.data;
             $rootScope.loading = false;
         }).catch(function(e){
             $rootScope.loading = false;
         });
     }

     api.terceros().get().then(function(response){
         $rootScope.terceros = response.data;
         $rootScope.loading = false;
     }).catch(function(e){
         $rootScope.loading = false;
     });

     api.categoria().get().then(function(response){
        $scope.categorias = response.data;
        $rootScope.loading = false;
    }).catch(function(e){
        $rootScope.loading = false;
    });

    api.estados_documentos().get().then(function(response){
        $scope.estados = response.data;
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
     $rootScope.formEdit.estado = $rootScope.formEdit.estado ?  ($rootScope.formEdit.estado = 'Activo') : ($rootScope.formEdit.estado = 'Inactivo');
     $rootScope.modal = $modal.open({
        backdrop: 'static',
         templateUrl: 'views/terceros/edit_record.html',
         controller : 'tercerosCtrl'
     });
 }

 $scope.update = function(){
     if($scope.formRecordEdit.$valid){
         $rootScope.loading = true;

         var obj = {};

         obj.nombre = $rootScope.formEdit.nombre;
         obj.categoriadto = $rootScope.formEdit.categoriadto._id;
         obj.telefono = $rootScope.formEdit.telefono;
         obj.razonsocial = $rootScope.formEdit.razonsocial;
         obj.direccion = $rootScope.formEdit.direccion;
         obj.email = $rootScope.formEdit.email;
         obj.estado = ($rootScope.formEdit.estado == 'Activo') ? true   : false
        
         $rootScope.modal.close();
         api.terceros($rootScope.formEdit.id).put(obj).then(function(response){
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

         api.terceros().post($scope.form.data).then(function(response){
             $scope.load();;
             $rootScope.loading = false;
             $scope.homerTemplate = 'views/notification/notify.html';
             delete $scope.form.data;
             notify({ message: 'Registro de tercero creado.', classes: 'alert-success', templateUrl: $scope.homerTemplate});
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
     api.terceros(id).delete().then(function(response){
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

         var obj = {};

         obj.nombre = $rootScope.formEdit.nombre;
         obj.categoriadto = $rootScope.formEdit.categoriadto._id;
         obj.telefono = $rootScope.formEdit.telefono;
         obj.razonsocial = $rootScope.formEdit.razonsocial;
         obj.direccion = $rootScope.formEdit.direccion;
         obj.email = $rootScope.formEdit.email;
         obj.estado = ($rootScope.formEdit.estado == 'Activo') ? true   : false
        
         $rootScope.modal.close();
         api.terceros($rootScope.formEdit.id).put(obj).then(function(response){
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
/**
 *
 * chartistCtrl
 *
 */

angular
    .module('homer')
    .controller('chartistCtrl', chartistCtrl);

function chartistCtrl($scope) {


    $scope.lineData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: [
            [12, 9, 7, 8, 5],
            [2, 1, 3.5, 7, 3],
            [1, 3, 4, 5, 6]
        ]
    };

    $scope.lineOptions = {
        fullWidth: true,
        chartPadding: {
            right: 40
        }
    };

    $scope.pieData = {
        series: [10, 5, 5]
    };


    $scope.guageData = {
        series: [25, 25, 25, 25]
    };

    $scope.guageOptions = {
        donut: true,
        donutWidth: 60,
        startAngle: 270,
        total: 200,
        showLabel: false
    };


    $scope.hbarData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        series: [
            [2, 3, 4, 5, 6, 7, 8],
            [3, 4, 5, 6, 7, 8, 9]
        ]
    };

    $scope.hbarOptions = {
        seriesBarDistance: 10,
        reverseData: true,
        horizontalBars: true,
        axisY: {
            offset: 70
        }
    };

    $scope.sbarData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        series: [
            [800000, 1200000, 1400000, 1200000],
            [200000, 400000, 500000, 300000],
            [300000, 300000, 400000, 600000]
        ]
    };

    $scope.sbarOptions = {
        stackBars: true,
        axisY: {
            labelInterpolationFnc: function(value) {
                return (value / 1000) + 'k';
            }
        }
    };

    $scope.areaData = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8],
        series: [[5, 9, 7, 8, 5, 3, 5, 4]
        ]
    };

    $scope.areaOptions = {
        low: 0,
        showArea: true
    };

}
/**
 *
 * codeEditorCtrl
 *
 */

angular
    .module('homer')
    .controller('codeEditorCtrl', codeEditorCtrl)

function codeEditorCtrl($scope) {

    $scope.editorOptions = {
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true
    };

}
/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */

angular
    .module('homer')
    .directive('touchSpin', touchSpin)


/**
 * touchSpin - Directive for Bootstrap TouchSpin
 */
function touchSpin() {
    return {
        restrict: 'A',
        scope: {
            spinOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.spinOptions, function(){
                render();
            });
            var render = function () {
                $(element).TouchSpin(scope.spinOptions);
            };
        }
    }
};