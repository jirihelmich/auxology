function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider) {

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
        .state('examinations', {
            abstract: true,
            url: "/examinations",
            templateUrl: "views/common/content.html",
            data: {pageTitle: 'Vyšetření'}
        })
        .state('examinations.new', {
            url: '/new/:patientId',
            templateUrl: "views/examination/new.html"
        })
        .state('examinations.edit', {
            url: '/edit/:patientId/:examinationId',
            templateUrl: "views/examination/new.html"
        })
        .state('patients.dashboard', {
            url: '/dashboard',
            templateUrl: "views/patient/dashboard.html"
        })
        .state('patients.detail', {
            url: '/detail/:id',
            templateUrl: "views/patient/detail.html"
        })
        .state('patients.new', {
            url: '/new',
            templateUrl: "views/patient/new.html"
        })
        .state('patients.edit', {
            url: '/edit/:id',
            templateUrl: "views/patient/new.html"
        })
        .state('patients.list', {
            url: '/list',
            templateUrl: "views/patient/contacts.html"
        })
        .state('lockscreen', {
            url: '/lockscreen',
            templateUrl: "views/lockscreen.html"
        })
        .state('logout', {
            url: '/logout',
            templateUrl: "views/logout.html"
        })
        .state('login', {
            url: '/login',
            templateUrl: "views/user/login.html",
            data: {pageTitle: 'Přihlášení', specialClass: 'gray-bg'}
        })
        .state('register', {
            url: '/register',
            templateUrl: "views/user/register.html",
            data: {pageTitle: 'Registrace', specialClass: 'gray-bg'}
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
    .config(config)
    .config(['lovefieldProvider', dbSchema])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('auxology');
        localStorageServiceProvider.setStorageType('sessionStorage');
    })
    .value('googleChartApiConfig', chartsApiConfig)
    .run(function ($rootScope, $state, $location, $timeout, sessionModel, $q) {
        $rootScope.$state = $state;

        $q.resolve = $q.when;

        $rootScope.$on('$stateChangeStart', function (e, toState) {
            var isLogin = toState.name === 'login';
            var isRegister = toState.name === 'register';
            if (isLogin || isRegister) {
                return;
            }

            var user = sessionModel.getCurrentUser();

            if (!user) {
                e.preventDefault();
                $state.go('login');
            }
        });
    });
