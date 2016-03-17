angular.module('auxology').service('asyncUtils', ['$q', function ($q) {
    return {
        deferredAction: function (asyncAction) {
            var deferred = $q.defer();
            asyncAction(deferred.resolve, deferred.reject);
            return deferred.promise;
        }
    };
}]);
