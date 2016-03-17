angular.module('auxology').service('sessionModel', ['asyncUtils', 'passwordService', 'userModel', function (asyncUtils, passwordService, userModel) {

    var currentUser = {id: 2};

    return {
        getCurrentUser: function () {
            return currentUser;
        },
        signOut: function () {
            currentUser = null;
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

                        currentUser = user;
                        resolve(user);
                    }, reject);

                }, reject);
            });
        }
    };

}]);