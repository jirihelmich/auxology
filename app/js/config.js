function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $urlRouterProvider.otherwise("/patients/dashboard");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('patients', {
            abstract: true,
            url: "/patients",
            templateUrl: "views/common/content.html"
        })
        .state('patients.dashboard', {
            url: '/dashboard',
            templateUrl: "views/dashboard.html"
        })
        .state('charts', {
            abstract: true,
            url: "/charts",
            templateUrl: "views/common/content.html",
        })
        .state('charts.flot_chart', {
            url: "/flot_chart",
            templateUrl: "views/graph_flot.html",
            data: {pageTitle: 'Flot chart'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'angular-flot',
                            files: ['js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js',]
                        }
                    ]);
                }
            }
        });

}
angular
    .module('auxology')
    .config(config)
    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    });
