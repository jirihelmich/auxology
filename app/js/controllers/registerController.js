function RegisterController($scope, userModel, $state) {

    $scope.username = null;
    $scope.password = null;

    $scope.createAccount = function () {

        userModel.create($scope.username, $scope.password).then(function (result) {

            $state.go('login');

        }, function (error) {

            console.log(error);

        });

    };

}