function PatientListController($scope, patientModel) {

    $scope.patients = [];
    patientModel.all().then(function (patients) {
        safeApply($scope, function () {
            $scope.patients = patients;
            $scope.count = patients.length;
        });
    });
}