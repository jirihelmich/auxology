function DashboardController($scope, patientModel) {

    $scope.search = function () {
        console.log($scope.searchToken);
    };

    $scope.patients = [];

    patientModel.recent(10).then(function (patients) {
        $scope.$apply(function () {
            $scope.patients = patients;
        });
    }, function (error) {
        console.log(error);
    });

}