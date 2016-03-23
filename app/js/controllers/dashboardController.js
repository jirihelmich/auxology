function DashboardController($scope, patientModel) {

    var patientsLoaded = function (patients) {
        safeApply($scope, function () {
            $scope.patients = patients;
        });
    };

    var error = function (error) {
        console.log(error);
    };

    $scope.patients = [];

    $scope.search = function () {
        patientModel.search($scope.searchToken, 10).then(patientsLoaded, error)
    };

    patientModel.recent(10).then(patientsLoaded, error);

}