function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $urlRouterProvider.otherwise("/patients/dashboard");

    $ocLazyLoadProvider.config({
        debug: false
    });

    $stateProvider
        .state('patients', {
            abstract: true,
            url: "/patients",
            templateUrl: "views/common/content.html",
            data: {pageTitle: 'Pacienti'}
        })
        .state('patients.dashboard', {
            url: '/dashboard',
            templateUrl: "views/dashboard.html"
        })
        .state('patients.detail', {
            url: '/detail',
            templateUrl: "views/detail.html"
        })
        .state('lockscreen', {
            url: '/lockscreen',
            templateUrl: "views/lockscreen.html"
        })
        .state('charts', {
            abstract: true,
            url: "/charts",
            templateUrl: "views/common/content.html"
        })
        .state('charts.flot_chart', {
            url: "/flot_chart",
            templateUrl: "views/chart.html",
        });
}

var chartsApiConfig = {
    version: '1.1',
    optionalSettings: {
        packages: ['corechart', 'line', 'bar'],
        language: 'cs'
    }
};

angular
    .module('auxology')
    .config(config).value('googleChartApiConfig', chartsApiConfig)
    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    });
