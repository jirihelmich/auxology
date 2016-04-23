angular.module('auxology').service('sessionModel',
    ['asyncUtils', 'passwordService', 'userModel', 'localStorageService',
        function (asyncUtils, passwordService, userModel, localStorageService) {

    return {
        getCurrentUser: function () {
            return localStorageService.get('currentUser');
        },
        signOut: function () {
            localStorageService.set('currentUser', null);
        },
        signIn: function (username, password) {
            return asyncUtils.deferredAction(function (resolve, reject) {
                userModel.getByUsername(username).then(function (users) {
                    if (!users || users.length !== 1) {
                        resolve(false);
                        return;
                    }

                    var user = users[0];

                    passwordService.compare(password, user.password).then(function (result) {
                        if (!result) {
                            resolve(false);
                            return;
                        }

                        localStorageService.set('currentUser', user);
                        resolve(user);
                    }, reject);

                }, reject);
            });
        }
    };

}]);