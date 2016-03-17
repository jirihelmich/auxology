function LoginController($scope, sessionModel, $state) {

    $scope.username = null;
    $scope.password = null;

    $scope.login = function () {

        sessionModel.signIn($scope.username, $scope.password).then(function(user){
            $state.go('patients.dashboard');
        }, function(error){
            console.log(error);
        });

    };

}