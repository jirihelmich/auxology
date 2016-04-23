(function () {
    angular.module('auxology', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'ngIdle',                       // Idle timer
        'ngSanitize',                   // ngSanitize
        'googlechart',
        'kutomer.ng-lovefield',
        'LocalStorageModule'
    ])
})();