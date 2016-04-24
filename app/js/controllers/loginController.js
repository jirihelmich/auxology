function LoginController($scope, sessionModel, $state, toaster) {

    $scope.username = null;
    $scope.password = null;

    $scope.login = function () {

        sessionModel.signIn($scope.username, $scope.password).then(function (user) {
            if (!user) {
                notify(toaster, 'Chyba', 'Přihlášení selhalo. Zkontrolujte své přihlašovací údaje.', 'error');
            } else {
                $state.go('patients.dashboard');
            }
        }, function (error) {
            notify(toaster, 'Chyba', 'Neočekávaná chyba aplikace.', 'error');
            console.log(error);
        });

    };

}