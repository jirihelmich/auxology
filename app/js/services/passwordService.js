angular.module('auxology').service('passwordService', ['asyncUtils', function (asyncUtils) {

    var onResultFactory = function (resolve, reject) {
        return function (error, result) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        };
    };

    return {
        hash: function (password) {
            return asyncUtils.deferredAction(function (resolve, reject) {
                bcrypt.hash(password, 10, onResultFactory(resolve, reject));
            });
        },
        compare: function (password, encryptedPassword) {
            return asyncUtils.deferredAction(function (resolve, reject) {
                bcrypt.compare(password, encryptedPassword, onResultFactory(resolve, reject));
            });
        }
    };

}]);